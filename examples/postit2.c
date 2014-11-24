CURL *curl = curl_easy_init();
 if(curl) {
   /* we want to use our own read function */
   curl_easy_setopt(curl, CURLOPT_READFUNCTION, read_callback);


  /* enable uploading */
   curl_easy_setopt(curl, CURLOPT_UPLOAD, 1L);


  /* specify target */
   curl_easy_setopt(curl, CURLOPT_URL, "ftp://example.com/dir/to/newfile");


  /* now specify which pointer to pass to our callback */
   curl_easy_setopt(curl, CURLOPT_READDATA, hd_src);


  /* Set the size of the file to upload */
   curl_easy_setopt(curl, CURLOPT_INFILESIZE_LARGE, (curl_off_t)fsize);


  /* Now run off and do what you've been told! */
   curl_easy_perform(curl);
 }