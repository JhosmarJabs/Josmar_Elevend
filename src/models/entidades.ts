namespace entidades {
    export enum eColumna {
        Nombre = 1,
        APaterno = 2,
        AMaterno = 3,
        Telefono = 4,
        Fecha = 5,
    }

    export enum eNotificacion {

        Success = 1,
        Error = 2,
        Warning = 3,
        Info = 4
    }
    
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
        type: eNotificacion,
        title: string,
        message: string
    }
}