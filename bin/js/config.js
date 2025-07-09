var config;
(function (config) {
    class ApiConfig {
    }
    ApiConfig.API_BASE_URL = "http://localhost:5075/MiWebService";
    ApiConfig.API_PERSONAS = `${ApiConfig.API_BASE_URL}/GetPersonas`;
    ApiConfig.API_CREATE_PERSONA = `${ApiConfig.API_BASE_URL}/CreatePersona`;
    ApiConfig.API_UPDATE_PERSONA = `${ApiConfig.API_BASE_URL}/UpdatePersona`;
    ApiConfig.API_DELETE_PERSONA = `${ApiConfig.API_BASE_URL}/DeletePersona`;
    ApiConfig.API_EMPRESAS = `${ApiConfig.API_BASE_URL}/GetEmpresas`;
    config.ApiConfig = ApiConfig;
})(config || (config = {}));
//# sourceMappingURL=config.js.map