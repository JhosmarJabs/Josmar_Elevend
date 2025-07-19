namespace data {

    export class datoUsuarios {
        private _error = new Data.ErrorData();
        private _alert = new controller.Notificacion();
        public usuariosMapeados: Map<number, entidades.IPersona> = new Map();
        private ultimaFechaModificacion: string = '';
        private onDataUpdated: (() => void) | null = null;

        // Método para establecer callback cuando los datos se actualizan
        public setOnDataUpdated(callback: () => void): void {
            this.onDataUpdated = callback;
        }

        // Public
        public loadUsersAPI(): void {
            this.cargarUsuarios();
        }

        public createUserAPI(persona: entidades.IPersona): void {
            this.crearPersona(persona);
        }

        public updateUserAPI(persona: entidades.IPersona): void {
            this.actualizarPersona(persona);
        }

        public deleteUserAPI(id: number): void {
            this.eliminarPersona(id);
        }


















        private cargarUsuarios() {
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
                    console.log('Datos recibidos:', data);

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
                    }

                    if (data.length > 0) {
                        const ultimoElemento = data[data.length - 1];
                        if (ultimoElemento.fModificacion) {
                            this.ultimaFechaModificacion = ultimoElemento.fModificacion;
                        }
                    }

                    resp = this._error.analizaRespuesta(data.length, 1);
                    
                    // Notificar que los datos se actualizaron
                    if (this.onDataUpdated) {
                        this.onDataUpdated();
                    }
                })
                .catch(error => {
                    console.error('Error al cargar usuarios:', error);
                });
            
            return resp;
        }

        private crearPersona(persona: entidades.IPersona): void {
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
                    this._error.analizaRespuesta(data, 2);
                    
                    // Recargar usuarios para actualizar el Map
                    this.loadUsersAPI();
                })
                .catch(error => {
                    console.error("Error al crear persona:", error);
                });
        }

        private actualizarPersona(persona: entidades.IPersona): void {
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
                    
                    // Recargar usuarios para actualizar el Map
                    this.loadUsersAPI();
                })
                .catch(error => {
                    console.error("Error al actualizar persona:", error);
                });
        }

        private eliminarPersona(id: number): void {
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
                    console.log("Persona eliminada correctamente:", data);
                    this._error.analizaRespuesta(data, 4);
                    this.usuariosMapeados.delete(id);
                    
                    // Notificar que los datos se actualizaron
                    if (this.onDataUpdated) {
                        this.onDataUpdated();
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar persona:", error);
                });
        }

    }

}
