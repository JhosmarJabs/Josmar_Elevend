namespace config {
    export class ApiConfig {
        public static readonly API_BASE_URL: string = "http://192.168.15.135:5075/MiWebService";

        public static readonly API_PERSONAS: string = `${ApiConfig.API_BASE_URL}/GetPersonas`;
        public static readonly API_CREATE_PERSONA: string = `${ApiConfig.API_BASE_URL}/CreatePersona`;
        public static readonly API_UPDATE_PERSONA: string = `${ApiConfig.API_BASE_URL}/UpdatePersona`;
        public static readonly API_DELETE_PERSONA: string = `${ApiConfig.API_BASE_URL}/DeletePersona`;

        public static readonly API_EMPRESAS: string = `${ApiConfig.API_BASE_URL}/GetEmpresas`;

    }
}