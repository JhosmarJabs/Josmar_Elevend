namespace Data {
    export class ErrorData {
        private LOAD_SUCCESS = 100;
        private LOAD_NO_DATA = 50;
        private LOAD_ERROR = 10;

        private CREATE_SUCCESS = 200;
        private CREATE_ERROR = 20;

        private UPDATE_SUCCESS = 300;
        private UPDATE_NOT_FOUND = 60;
        private UPDATE_ERROR = 30;

        private DELETE_SUCCESS = 400;
        private DELETE_NOT_FOUND = 70;
        private DELETE_ERROR = 40;


        public analizaRespuesta(backendResult: number, type: number): number {
            let _resp = 0;
            switch (type) {
                case 1:// Obtener
                    _resp = this.mapLoadResponse(backendResult);
                    break;
                case 2:// Crear
                    _resp = this.mapCreateResponse(backendResult);
                    break;
                case 3: // Actualizar
                    _resp = this.mapUpdateResponse(backendResult);
                    break;
                case 4: // Eliminar
                    _resp = this.mapDeleteResponse(backendResult);
                    break;
            }

            return _resp;
        }

        public mapLoadResponse(backendResult: number): number {
            if (backendResult > 0) return this.LOAD_SUCCESS;
            if (backendResult === 0) return this.LOAD_NO_DATA;
            return this.LOAD_ERROR;
        }

        public mapCreateResponse(backendResult: number): number {
            return backendResult > 0 ? this.CREATE_SUCCESS : this.CREATE_ERROR;
        }

        public mapUpdateResponse(backendResult: number): number {
            if (backendResult > 0) return this.UPDATE_SUCCESS;
            if (backendResult === 0) return this.UPDATE_NOT_FOUND;
            return this.UPDATE_ERROR;
        }

        public mapDeleteResponse(backendResult: number): number {
            if (backendResult > 0) return this.DELETE_SUCCESS;
            if (backendResult === 0) return this.DELETE_NOT_FOUND;
            return this.DELETE_ERROR;
        }
    }
}