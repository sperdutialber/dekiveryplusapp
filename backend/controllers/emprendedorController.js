const {
  crearProducto,
  obtenerProductosPorEmprendedor,
  actualizarProducto,
  eliminarProducto,
} = require('../models/productos');

exports.getProductos = async (req, res) => {
  try {
    const emprendedorId = req.usuario.id;
    const productos = await obtenerProductosPorEmprendedor(emprendedorId);
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const emprendedorId = req.usuario.id;
    const { nombre, descripcion, precio, stock } = req.body;

    const producto = await crearProducto(emprendedorId, nombre, descripcion, precio, stock);

    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const emprendedorId = req.usuario.id;
    const productoId = req.params.id;

    const producto = await actualizarProducto(productoId, emprendedorId, req.body);

    if (!producto) {
      return res.status(403).json({ error: 'No puedes modificar este producto' });
    }

    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const emprendedorId = req.usuario.id;
    const productoId = req.params.id;

    const eliminado = await eliminarProducto(productoId, emprendedorId);

    if (!eliminado) {
      return res.status(403).json({ error: 'No puedes eliminar este producto' });
    }

    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
