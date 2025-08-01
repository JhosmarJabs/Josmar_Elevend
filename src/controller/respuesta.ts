namespace Data {
    export class Respuesta {
        // mover 
        private notificacion: entidades.iNotificacion;
        private _notificacion: controller.Notificacion;

        public analizaRespuesta(backendResult: number, type: number): entidades.iNotificacion {
            let _resp: entidades.iNotificacion;
            switch (type) {
                case 1:// Obtener
                    this.mapLoadResponse(backendResult);
                    // this.createNotification(this.notificacion);
                    return
                case 2:// Crear
                    this.mapCreateResponse(backendResult);
                    this.createNotification(this.notificacion);
                    return
                case 3: // Actualizar
                    this.mapUpdateResponse(backendResult);
                    this.createNotification(this.notificacion);
                    return
                case 4: // Eliminar
                    this.mapDeleteResponse(backendResult);
                    this.createNotification(this.notificacion);
                    return
                default:
                    this.notificacion = {
                        type: entidades.eNotificacion.Error,
                        title: "Error del Sistema",
                        message: "Tipo de operación no reconocida"
                    };
                    this.createNotification(this.notificacion);
                    return this.notificacion;
            }
        }


        public createNotification(notification: entidades.iNotificacion): void {
            this._notificacion = new controller.Notificacion(notification);
        }

        public mapLoadResponse(backendResult: number): entidades.iNotificacion {
            if (backendResult > 0) {
                this.notificacion = {
                    type: entidades.eNotificacion.Success,
                    title: "Cargar Datos",
                    message: "Los datos se cargaron correctamente"
                };
            } else if (backendResult === 0) {
                this.notificacion = {
                    type: entidades.eNotificacion.Warning,
                    title: "Cargar Datos",
                    message: "No se encontraron datos"
                };
            } else {
                this.notificacion = {
                    type: entidades.eNotificacion.Error,
                    title: "Cargar Datos",
                    message: "Ocurrió un error al cargar los datos"
                };
            }
            return this.notificacion;
        }

        public mapCreateResponse(backendResult: number): entidades.iNotificacion {
            if (backendResult > 0) {
                this.notificacion = {
                    type: entidades.eNotificacion.Success,
                    title: "Crear Datos",
                    message: "Los datos se crearon correctamente"
                };
            } else {
                this.notificacion = {
                    type: entidades.eNotificacion.Error,
                    title: "Crear Datos",
                    message: "Ocurrió un error al crear los datos"
                };
            }
            return this.notificacion;
        }

        public mapUpdateResponse(backendResult: number): entidades.iNotificacion {
            if (backendResult > 0) {
                this.notificacion = {
                    type: entidades.eNotificacion.Success,
                    title: "Actualizar Datos",
                    message: "Los datos se actualizaron correctamente"
                };
            } else if (backendResult === 0) {
                this.notificacion = {
                    type: entidades.eNotificacion.Warning,
                    title: "Actualizar Datos",
                    message: "No se encontraron datos para actualizar"
                };
            } else {
                this.notificacion = {
                    type: entidades.eNotificacion.Error,
                    title: "Actualizar Datos",
                    message: "Ocurrió un error al actualizar los datos"
                };
            }
            return this.notificacion;
        }

        public mapDeleteResponse(backendResult: number): entidades.iNotificacion {
            if (backendResult > 0) {
                this.notificacion = {
                    type: entidades.eNotificacion.Success,
                    title: "Eliminar Datos",
                    message: "Los datos se eliminaron correctamente"
                };
            } else if (backendResult === 0) {
                this.notificacion = {
                    type: entidades.eNotificacion.Warning,
                    title: "Eliminar Datos",
                    message: "No se encontraron datos para eliminar"
                };
            } else {
                this.notificacion = {
                    type: entidades.eNotificacion.Error,
                    title: "Eliminar Datos",
                    message: "Ocurrió un error al eliminar los datos"
                };
            }
            return this.notificacion;
        }
    }
}