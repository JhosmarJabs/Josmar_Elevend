namespace data {
    export class datoUsuarios {
        private _respuesta = new Data.Respuesta();
        public usuariosMapeados: Map<number, entidades.IPersona> = new Map();
        private ultimaFechaModificacion: string = '';

        public loadUsersAPI(callback: (success: boolean) => void): void {
            const url = config.ApiConfig.API_PERSONAS;
            const requestBody = this.ultimaFechaModificacion
                ? { FModificacion: this.ultimaFechaModificacion }
                : {};

            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            })
                .then(response => response.json())
                .then(data => {
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
                        if (element.fModificacion > this.ultimaFechaModificacion)
                            this.ultimaFechaModificacion = element.fModificacion;
                    }
                    this._respuesta.analizaRespuesta(data.length, 1);
                    const success = data.length >= 0;

                    callback(success);
                })
                .catch(error => {
                    console.error('Error al cargar usuarios:', error);
                    this._respuesta.analizaRespuesta(-300, 1);
                    callback(false);
                });
        }

        public createUserAPI(persona: entidades.IPersona, callback: (success: boolean) => void): void {
            fetch(config.ApiConfig.API_CREATE_PERSONA, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                    this._respuesta.analizaRespuesta(data, 2);
                    const success = data > 0;

                    if (success)
                        persona.id = data;

                    this.usuariosMapeados.set(persona.id, persona);
                    console.log("Usuario creado:", persona, this.usuariosMapeados);

                    callback(success);
                })
                .catch(error => {
                    console.error("Error al crear persona:", error);
                    this._respuesta.analizaRespuesta(-300, 2);
                    callback(false);
                });
        }

        public updateUserAPI(persona: entidades.IPersona, callback: (success: boolean) => void): void {
            fetch(config.ApiConfig.API_UPDATE_PERSONA, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                    this._respuesta.analizaRespuesta(data, 3);
                    const success = data > 0;

                    if (success)
                        this.usuariosMapeados.set(persona.id, persona);

                    console.log("Usuario actualizado:", persona, this.usuariosMapeados);


                    callback(success);
                })
                .catch(error => {
                    console.error("Error al actualizar persona:", error);
                    this._respuesta.analizaRespuesta(-300, 3);
                    callback(false);
                });
        }

        public deleteUserAPI(id: number, callback?: (success: boolean) => void): void {
            fetch(config.ApiConfig.API_DELETE_PERSONA, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(id)
            })
                .then(response => {
                    if (!response.ok)
                        throw new Error(`Error HTTP: ${response.status}`);

                    return response.json();
                })
                .then(data => {
                    this._respuesta.analizaRespuesta(data, 4);

                    const success: boolean = data > 0;

                    if (success) {
                        this.usuariosMapeados.delete(id);
                    }

                    callback?.(success);
                })
                .catch(error => {
                    console.error("Error al eliminar persona:", error);
                    this._respuesta.analizaRespuesta(-1, 4);

                    callback?.(false);
                });
        }

        public getUsersArray(): entidades.IPersona[] {
            return Array.from(this.usuariosMapeados.values());
        }

        public getUserById(id: number): entidades.IPersona {
            return this.usuariosMapeados.get(id);
        }
    }
}