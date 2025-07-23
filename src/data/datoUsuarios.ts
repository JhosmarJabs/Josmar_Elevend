namespace data {

    export class datoUsuarios {
        private _error = new Data.ErrorData();
        // private _alert = new controller.Notificacion();
        public usuariosMapeados: Map<number, entidades.IPersona> = new Map();
        private ultimaFechaModificacion: string = '';


        // Public
        public loadUsersAPI(callback?: (resp: number) => void): void {
            this.cargarUsuarios((resp: number) => {
                if (callback) callback(resp);
            });
        }

        public createUserAPI(persona: entidades.IPersona, callback?: (resp: number) => void): void {
            this.crearPersona(persona), (resp: number) => {
                if (callback) callback(resp);
            };
        }

        public updateUserAPI(persona: entidades.IPersona, callback?: (resp: number) => void): void {
            this.actualizarPersona(persona, (resp: number) => {
                if (callback) callback(resp);
            });
        }


        public deleteUserAPI(id: number, callback?: (resp: number) => void): void {
            this.eliminarPersona(id, (resp: number) => {
                if (callback) callback(resp);
            });
        }

        public getUsersArray(): entidades.IPersona[] {
            return Array.from(this.usuariosMapeados.values());
        }

        public getUserById(id: number): entidades.IPersona {
            return this.usuariosMapeados.get(id);
        }

        // Private
        private cargarUsuarios(callback: (resp: number) => void): void {
            let resp: number;

            const url = config.ApiConfig.API_PERSONAS;

            const requestBody = this.ultimaFechaModificacion
                ? { FModificacion: this.ultimaFechaModificacion }
                : {};

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => response.json())
                .then(data => {

                    console.log(data, this.ultimaFechaModificacion);
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        const persona: entidades.IPersona = {
                            id: element.id,
                            nombre: element.nombre,
                            aPaterno: element.aPaterno,
                            aMaterno: element.aMaterno,
                            telefono: element.telefono,
                            fechaNacimiento: new Date(element.fechaNacimiento),
                            correo: element.correo,
                            nameTag: element.nameTag,
                            empresa: element.empresaId
                        };

                        this.usuariosMapeados.set(persona.id, persona);
                        if (element.fModificacion > this.ultimaFechaModificacion) {
                            this.ultimaFechaModificacion = element.fModificacion;
                        }
                    }

                    resp = this._error.analizaRespuesta(data.length, 1);

                    if (callback)
                        callback(resp);
                })
                .catch(error => {
                    console.error('Error al cargar usuarios:', error);
                    if (callback) {
                        callback(-100);
                    }
                });
        }

        private crearPersona(persona: entidades.IPersona, callback?: (resp: number, nuevoId?: number) => void): void {
            let resp: number;
            fetch(config.ApiConfig.API_CREATE_PERSONA, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: 0,
                    nombre: persona.nombre,
                    aPaterno: persona.aPaterno,
                    aMaterno: persona.aMaterno,
                    telefono: persona.telefono,
                    fechaNacimiento: persona.fechaNacimiento.toISOString().split('T')[0],
                    correo: persona.correo,
                    nameTag: persona.nameTag,
                    empresaId: persona.empresa,
                    enUso: true
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Persona creada:', data);

                    this.usuariosMapeados.set(persona.id, persona);

                    resp = this._error.analizaRespuesta(data.length, 2);
                    if (callback)
                        callback(resp);

                })
                .catch(error => {
                    console.error("Error al crear persona:", error);
                    if (callback) {
                        callback(-200);
                    }
                });
        }

        private actualizarPersona(persona: entidades.IPersona, callback?: (resp: number) => void): void {
            let resp: number;
            fetch(config.ApiConfig.API_UPDATE_PERSONA, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: persona.id,
                    nombre: persona.nombre,
                    aPaterno: persona.aPaterno,
                    aMaterno: persona.aMaterno,
                    telefono: persona.telefono,
                    fechaNacimiento: persona.fechaNacimiento.toISOString().split('T')[0],
                    correo: persona.correo,
                    nameTag: persona.nameTag,
                    empresaId: persona.empresa,
                    enUso: true
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Persona actualizada:', data);
                    this._error.analizaRespuesta(data, 3);

                    resp = this._error.analizaRespuesta(data, 3);

                    if (callback)
                        callback(resp);

                })
                .catch(error => {
                    console.error("Error al actualizar persona:", error);
                });
        }

        private eliminarPersona(id: number, callback?: (resp: number) => void): number {
            let resp: number;
            const url = config.ApiConfig.API_DELETE_PERSONA;

            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(id)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {

                    console.log("Persona eliminada:", data);
                    resp = this._error.analizaRespuesta(data, 4);
                    this.usuariosMapeados.delete(id);

                    if (callback) {
                        callback(resp);
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar persona:", error);
                });

            return resp;
        }

    }

}
