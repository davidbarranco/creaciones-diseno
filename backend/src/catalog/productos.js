const productos = [
    {
        id: 1,
        nombre: "Camiseta personalizada",
        categoria: "Camisetas",
        precio: 50000
    },
    {
        id: 2,
        nombre: "Mug personalizado",
        categoria: "Mugs",
        precio: 25000
    },
    {
        id: 3,
        nombre: "Camiseta básica",
        categoria: "Camisetas",
        precio: 45000
    },
    {
        id: 4,
        nombre: "Productos decorativos",
        categoria: "Decoración",
        precio: 35000
    }
];

function buscarProductoPorId(id) {
    return productos.find(function (producto) {
        return producto.id === Number(id);
    });
}

module.exports = {
    productos,
    buscarProductoPorId
};