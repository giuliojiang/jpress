mainApp.service("binupload", function(jswindow, session, socket, $timeout) {

    var self = this;
    var priv = {};
    var CHUNK_SIZE = 1024 * 100; // 100KB
    var MAX_QUEUED_SIZE = 50 * CHUNK_SIZE; // Allow the network to queue
    var doc = jswindow.get_window().document;

    // Contains objects of form:
    // {file, callback, transfer_id, chunk_handle, finalize_handle}
    // file is the file to be uploaded
    // callback is the callback of process_file
    // transfer_id is the server-assigned transfer id
    // chunk_handle is the timeout handle for the next waiting chunk
    // finalize_handle is the timeout handle for the final confirmation
    //                 response. It needs to be canceled if the server
    //                 completes or aborts the transfer.
    var upload_queue = [];
    var current_job = null;

    // Other controllers can register an on_complete callback
    // function(uploaded_file_url, uploaded_file_name)
    var on_upload_complete = null;

    // TODO progress reporter, complete and failure callbacks

    // Private methods ========================================================

    var register_handlers = function() {

        socket.register("_bin_up", function(msgobj) {
            priv.current_job_received_id(msgobj.transfer_id, msgobj.name);
        });

        socket.register("_bin_up_complete", function(msgobj) {
            priv.bin_up_complete_handler(msgobj);
        });

    };

    priv.bin_up_complete_handler = function(msgobj) {
        var tid = msgobj.transfer_id;

        // Check that transfer id is the one of the current transfer
        if (tid != current_job.transfer_id) {
            console.info("ERROR _bin_up_complete received for ["+tid+"] but currently processing ["+current_job.transfer_id+"]");
            return;
        }

        // Signal the on_upload_complete callback
        if (on_upload_complete) {
            var file_url = "https://" + socket.get_endpoint() + "/download/" + msgobj.file_id;
            on_upload_complete(file_url, current_job.file.name);
        }

        // Cancel the finalization timeout
        if (current_job.finalize_handle) {
            $timeout.cancel(current_job.finalize_handle);
            current_job.finalize_handle = null;
        }

        var file_id = msgobj.file_id;
        if (file_id == null) {
            console.info("SERVER SIGNAL: UPLOAD FAILED");

            // Cancel the next chunk
            if (current_job.chunk_handle) {
                $timeout.cancel(current_job.chunk_handle);
                current_job.chunk_handle = null;
            }
        } else {
            console.info("Server confirmed: transfer complete");
            console.info("ID is " + msgobj.file_id);
        }

        // Fire upload complete callback for the job
        current_job.callback();

        // Clean job
        priv.clean_current_job();
    };

    // Clears the data of the current job and starts processing the next
    // job. This function is used both for success and failure
    priv.clean_current_job = function() {
        current_job = null;
        async.setImmediate(function() {
            priv.process_queue();
        });
    };

    // Callback: function()
    priv.upload_data_chunk = function(data, callback) {
        // Check for size of the network queue
        if (socket.unsent_bytes_more_than(MAX_QUEUED_SIZE)) {
            console.info("Chunk wait");
            // Wait for a little bit and retry
            current_job.chunk_handle = $timeout(function() {
                current_job.chunk_handle = null;
                priv.upload_data_chunk(data, callback);
            }, 50);
        } else {
            // send the data packet and callback
            socket.send({
                _t: "_bin",
                transfer_id: current_job.transfer_id,
                data: data,
                token: session.get_token(),
            });
            console.info("Chunk up");
            callback();
        }
    };

    // Callback: function()
    priv.read_file_chunk = function(file, start, end, callback) {
        var blob = file.slice(start, end);
        var reader = new FileReader();
        reader.readAsDataURL(blob); // read as base64
        reader.onloadend = function() {
            data = reader.result;
            data = data.split(",")[1]; // Remove header
            priv.upload_data_chunk(data, callback);
        };
    };

    priv.finalize_current_job = function() {
        current_job.finalize_handle = $timeout(function() {
            current_job.finalize_handle = null;
            current_job.callback();
            priv.clean_current_job();
        }, 5000); // Wait 5 seconds
    };

    priv.current_job_start_data_transfer = function() {

        var file = current_job.file;
        var file_size = file.size;
        var current_position = 0;

        var do_chunk = function() {
            // We are now past the end of the file, finished reading
            if (current_position >= file_size) {
                // Send end of file message
                socket.send({
                    _t: "_bin_end",
                    transfer_id: current_job.transfer_id,
                    token: session.get_token(),
                });
                priv.finalize_current_job();
                return;
            }

            // Compute end position for this chunk
            var start = current_position;
            var end = current_position + CHUNK_SIZE;
            if (end >= file_size) {
                end = file_size;
            }
            current_position = end;

            // Do the read
            priv.read_file_chunk(file, start, end, function() {
                do_chunk();
            });
        };
        do_chunk();

    };

    // Called when the handler receives the transfer id for the current job
    priv.current_job_received_id = function(tid, name) {

        // Check that the names match
        if (name != current_job.file.name) {
            console.info("Fatal error. File upload name mismatches received token identifier. Real file name ["+current_job.file.name+"], server sent ["+name+"]");
            // Callback for completed file upload
            current_job.callback();
            // Clean current job
            priv.clean_current_job();
            return;
        }

        // Set the transfer id in the object
        current_job.transfer_id = tid;

        // Start binary transfer
        priv.current_job_start_data_transfer();

    };

    var start_process_current_job = function() {

        console.info("Processing file upload: " + current_job.file.name);

        // Process the file upload

        // Send the token request message
        socket.send({
            _t: "_bin_up",
            token: session.get_token(),
            name: current_job.file.name
        });

        // TODO add a timeout in case the server does not reply with a valid
        // transfer id: remove the file from the job list

        // Next: receive a _bin_up message containing the transfer ID

    };

    priv.process_queue = function() {

        // Check for empty queue
        if (upload_queue.length == 0) {
            return;
        }

        // Check for jobs already running
        if (current_job) {
            // There is already an upload job being processed,
            // after that job completes, process_queue will be re-called
            // automatically
            return;
        }

        // Get 1 task from the queue
        var a_task = upload_queue[0];
        upload_queue.splice(0, 1); // remove first element from queue
        // Add the task to the current job
        current_job = a_task;

        // Start processing the current job
        start_process_current_job();

    };

    // Callback: function()
    var process_file = function(file, callback) {

        console.info("process_file::");

        // Add this file to the queue
        upload_queue.push({
            file: file,
            callback: callback
        });

        // Call the queue processor
        async.setImmediate(function() {
            priv.process_queue();
        });

    };

    // Public methods =========================================================

    // Start upload. Opens a file selector for the user to select the file
    // NOTE this function must be called in the same event originated from a
    // user event.
    self.upload_start_select_file = function() {
        var input_element = doc.createElement("input");
        input_element.setAttribute("type", "file");
        input_element.setAttribute("multiple", "multiple");
        input_element.style.visibility = "hidden";
        input_element.addEventListener("change", function(e) {
            var files = e.target.files;

            var i = 0;
            var do_one = function() {
                if (i >= files.length) {
                    // == @cleanup ==
                    doc.body.removeChild(input_element);
                    return;
                }

                var a_file = files[i];
                process_file(a_file, function() {
                    do_one();
                });

                i += 1;
            }
            do_one();
        }, false);
        doc.body.appendChild(input_element);
        input_element.click();

        // @cleanup code is run at the end
    };

    // <f> function(uploaded_file_url, uploaded_file_name)
    self.register_on_upload_complete = function(f) {
        on_upload_complete = f;
    }

    // Init ===================================================================

    register_handlers();

});
