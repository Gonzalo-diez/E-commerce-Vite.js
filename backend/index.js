import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();

// Conexión a la base de datos MongoDB
mongoose.connect("mongodb://localhost:27017/tienda", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (err) => {
    console.error("Error de conexión a MongoDB:", err);
});

db.once("open", () => {
    console.log("Conexión a MongoDB exitosa");
});

// Define el modelo de usuario en Mongoose
const userSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    correo_electronico: String,
    contrasena: String,
    productosCreados: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',
        },
    ],
});

const User = mongoose.model('User', userSchema);


// Define el modelo de producto en Mongoose
const productoSchema = new mongoose.Schema({
    nombre: String,
    marca: String,
    descripcion: String,
    precio: Number,
    stock: Number,
    categoria: String,
    imagen_url: String,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comentarios: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario'
    },
    compras: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compra'
    },
});

const Producto = mongoose.model('Producto', productoSchema);


// Define el modelo de comentario en Mongoose
const comentarioSchema = new mongoose.Schema({
    texto: String,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
    },
    nombre: String,
    fecha: {
        type: Date,
        default: Date.now,
    },
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

// Define el modelo de compra en Mongoose
const compraSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
            },
            cantidad: Number,
        },
    ],
    total: Number,
    pais: String,
    provincia: String,
    localidad: String,
    calle: String,
    telefono: Number,
    numero_tarjeta: Number,
    numero_seguridad: Number,
    fecha: {
        type: Date,
        default: Date.now,
    },
});

const Compra = mongoose.model('Compra', compraSchema);


// Configuración de Passport para autenticación local
passport.use(
    new LocalStrategy(
        {
            usernameField: "correo_electronico",
            passwordField: "contrasena",
        },
        async (correo_electronico, contrasena, done) => {
            try {
                const user = await User.findOne({ correo_electronico }).exec();

                if (!user || user.contrasena !== contrasena) {
                    return done(null, false, { message: "Credenciales inválidas" });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

app.use(express.json());
app.use(cors());
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Método sección inicio
app.get("/", async (req, res) => {
    try {
        const productos = await Producto.find({});
        return res.json(productos);
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método sección busqueda de productos según el categoria
app.get("/productos/:categoria", async (req, res) => {
    const categoria = req.params.categoria;

    try {
        // Utiliza el método find de Mongoose para buscar productos por categoria
        const productos = await Producto.find({ categoria }).exec();
        return res.json(productos);
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método sección busqueda del producto segun el id
app.get("/productos/detalle/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const productId = new mongoose.Types.ObjectId(id);

        const producto = await Producto.findOne({ _id: productId }).exec();

        if (!producto) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.json(producto);
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método de busqueda de comentarios según el id
app.get('/productos/comentarios/:id', async (req, res) => {
    const productoId = req.params.id;

    try {
        const comentarios = await Comentario.find({ producto: productoId }).populate('usuario').exec();

        if (!comentarios) {
            return res.status(404).json({ error: 'Comentarios no encontrados' });
        }

        return res.json(comentarios);
    } catch (err) {
        return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
    }
});

// Método para agregar productos
app.post("/agregarProductos", async (req, res) => {
    const {
        nombre,
        marca,
        descripcion,
        precio,
        stock,
        categoria,
        imagen_url,
        user,
    } = req.body;

    const userId = user._id;

    try {
        const nuevoProducto = new Producto({
            usuario: userId,
            nombre,
            marca,
            descripcion,
            precio,
            stock,
            categoria,
            imagen_url,
        });

        await nuevoProducto.save();

        // Agrega el nuevo producto al array productosCreados del usuario
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { productosCreados: nuevoProducto._id } },
            { new: true }
        ).populate('productosCreados');

        // Devuelve un objeto JSON con el mensaje y el producto creado
        return res.json({
            message: "Producto creado!!!",
            producto: nuevoProducto,
            user: updatedUser,
        });

    } catch (err) {
        console.error("Error al guardar el producto:", err);
        return res
            .status(500)
            .json({ error: "Error en la base de datos", details: err.message });
    }
});


// Método de registro
app.post("/registro", async (req, res, next) => {
    const { nombre, apellido, correo_electronico, contrasena } = req.body;

    try {
        const newUser = new User({
            nombre,
            apellido,
            correo_electronico,
            contrasena,
        });

        await newUser.save();

        passport.authenticate("local")(req, res, async () => {
            const userId = newUser._id;
            const populatedUser = await User.findById(userId).populate('productosCreados');
            return res.json({
                message: "Usuario registrado!",
                usuario: {
                    _id: userId,
                    nombre: newUser.nombre,
                    apellido: newUser.apellido,
                    correo_electronico: newUser.correo_electronico,
                    productosCreados: populatedUser.productosCreados, 
                },
            });
        });
    } catch (err) {
        return next(err);
    }
});

// Método login
app.post("/login", (req, res, next) => {
    const { correo_electronico, contrasena } = req.body;

    if (!correo_electronico || !contrasena) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            const userId = user._id;
            return res.json({ message: "Inicio de sesión exitoso",
            usuario: { _id: userId, nombre: user.nombre, apellido: user.apellido, correo_electronico: user.correo_electronico },});
        });
    })(req, res, next);
});

// Método para agregar comentarios
app.post('/productos/comentarios/agregar', async (req, res) => {
    const { texto, usuarioId, productoId, nombre } = req.body;

    try {
        const nuevoComentario = new Comentario({
            texto,
            usuario: usuarioId,
            producto: productoId,
            nombre: nombre,
        });

        await nuevoComentario.save();

        return res.json('Comentario agregado');
    } catch (err) {
        console.error('Error al guardar el comentario:', err);
        return res.status(500).json({ error: 'Error en la base de datos', details: err.message });
    }
});


// Método para editar el producto
app.put("/productos/editarProducto/:id", async (req, res) => {
    const productId = req.params.id;
    const { nombre, marca, descripcion, precio, stock, categoria, imagen_url } = req.body;

    try {
        const updatedProduct = await Producto.findByIdAndUpdate(
            productId,
            {
                nombre,
                marca,
                descripcion,
                precio,
                stock,
                categoria,
                imagen_url,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.json("Producto actualizado!");
    } catch (err) {
        console.error("Error en la actualización:", err);
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método para borrar un producto
app.delete("/productos/borrarProducto/:id", async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await Producto.deleteOne({ _id: productId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        return res.json("Producto eliminado!");
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Endpoint para realizar una compra
app.post("/comprar", async (req, res) => {
    const { productId, pais, provincia, localidad, calle, telefono, numero_tarjeta, numero_seguridad } = req.body;
    const usuarioId = User._id;

    try {
        const product = await Producto.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        if (product.stock === 0) {
            return res.status(400).json({ error: "Producto agotado" });
        }

        product.stock -= 1;
        await product.save();

        const compra = new Compra({
            usuario: usuarioId,
            productos: [{ producto: productId, cantidad: 1 }],
            pais: pais,
            provincia: provincia,
            localidad: localidad,
            calle: calle,
            telefono: telefono,
            numero_tarjeta: numero_tarjeta,
            numero_seguridad: numero_seguridad,
            total: product.precio,
        });

        await compra.save();

        return res.json({ message: "Compra exitosa, stock actualizado", producto: product });
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método para obtener los productos creados por un usuario
app.get("/usuario/productos-creados/:usuarioId", async (req, res) => {
    const usuarioId = req.params.usuarioId;

    try {
        const productosCreados = await Producto.find({ usuario: usuarioId }).populate('usuario').exec();
        return res.json(productosCreados);
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método para obtener los productos comprados por un usuario
app.get("/usuario/productos-comprados/:usuarioId", async (req, res) => {
    const usuarioId = req.params.usuarioId;

    try {
        const compras = await Compra.find({ usuario: usuarioId }).populate('productos.producto').exec();
        const productosComprados = compras.flatMap(compra => compra.productos.map(item => item.producto));

        return res.json(productosComprados);
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});


// Método para obtener los productos vendidos por un usuario
app.get("/usuario/productos-vendidos/:usuarioId", async (req, res) => {
    const usuarioId = req.params.usuarioId;

    try {
        const productosVendidos = await Producto.find({ usuario: usuarioId }).exec();
        return res.json(productosVendidos);
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});


// Método para obtener información del usuario (productos creados, comprados, vendidos)
app.get("/user/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const productosCreados = await Producto.find({ usuario: userId }).exec();

        const compras = await Compra.find({ usuario: userId }).populate('productos.producto').exec();
        const productosComprados = [];

        compras.forEach(compra => {
            compra.productos.forEach(producto => {
                productosComprados.push(producto.producto);
            });
        });

        const productosVendidos = await Producto.find({ 'compras.usuario': userId }).exec();

        return res.json({
            productosCreados,
            productosComprados,
            productosVendidos
        });
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método de detalle de usuario
app.get("/user/detalle/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const userId = new mongoose.Types.ObjectId(id);

        const user = await User.findOne({ _id: userId })
            .select("nombre apellido correo_electronico")
            .exec();

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.json(user);
    } catch (err) {
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método para editar el perfil de un usuario
app.put("/user/editarPerfil/:userId", async (req, res) => {
    const userId = req.params.userId;
    const { nombre, apellido, correo_electronico } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { nombre, apellido, correo_electronico },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.json("Perfil de usuario actualizado!");
    } catch (err) {
        console.error("Error en la actualización del perfil:", err);
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método para cambiar la contraseña de un usuario
app.put("/user/cambiarContrasena/:userId", async (req, res) => {
    const userId = req.params.userId;
    const { contrasena } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { contrasena },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        return res.json("Contraseña de usuario actualizada!");
    } catch (err) {
        console.error("Error en la actualización de la contraseña:", err);
        return res.status(500).json({ error: "Error en la base de datos", details: err.message });
    }
});

// Método para cerrar sesión
app.get("/logout", (req, res) => {
    req.logout();
    res.json({ message: "Sesión cerrada exitosamente" });
});

app.listen(8800, () => {
    console.log("Backend conectado");
});