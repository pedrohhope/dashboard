export const formatCentsToReais = (cents: number): string => {
    return (cents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};