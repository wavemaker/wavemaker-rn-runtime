export const WS_CONSTANTS = {
  NON_BODY_HTTP_METHODS: ['GET', 'HEAD'],
  NON_DATA_AXIOS_METHODS: ['GET', 'DELETE', 'HEAD', 'OPTIONS'],
  CONTENT_TYPES: {
    FORM_URL_ENCODED: 'application/x-www-form-urlencoded',
    MULTIPART_FORMDATA: 'multipart/form-data',
    OCTET_STREAM: 'application/octet-stream'
  },
  REST_SERVICE: {
    ERR_TYPE: {
      METADATA_MISSING: 'metadata_missing',
      CRUD_OPERATION_MISSING: 'crud_operation_missing',
      USER_UNAUTHORISED: 'user_unauthorised',
    },
    ERR_MSG: {
      METADATA_MISSING: 'Metadata missing for "$variable"',
      USER_UNAUTHORISED: 'Unauthorized User',
      CRUD_OPERATION_MISSING: 'Operation "$operation" not allowed for "$variable"',
    }
  }
};
