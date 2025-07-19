namespace entidades {

    export interface IEmpresa {
        id: number;
        nombre: string;
        ubicacion: string;
        fechaRegistro: string;
        fechaModificacion: string;
        enUso: boolean;
    }

    export interface IPersona {
        id: number;
        nombre: string;
        aPaterno: string;
        aMaterno: string;
        telefono: number;
        fechaNacimiento: Date;
        correo: string;
        nameTag: string;
        empresa: number;
    }

    export interface iNotificacion {
        type: string, 
        title: string, 
        message: string
    }
}