// utils/serverActions.ts
export async function withActionWrapper<T>(
    fn: () => Promise<T>
): Promise<
    | { status: 'success'; message: string; data?: T }
    | { status: 'error'; message: string; technicalMessage?: string }
> {
    try {
        const data = await fn();
        return {
            status: 'success',
            message: 'Acción realizada correctamente',
            data
        };
    } catch (error: any) {
        console.log(error)
        return {
            status: 'error',
            message: 'Ocurrió un error inesperado',
            technicalMessage: error?.message ?? 'Desconocido'
        };
    }
}


export const formatCurrency = (amount: number) => {
    return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}