const supabase = require('../config/supabase');

const getAllProducts = async (req, res) => {
    try {
        const{ data:products, error} = await supabase
        .from('products')
        .select('*')
        .order('id', {ascending: true});

        if (error) {
            throw error;
        }
        res.json({
            success: true,
            products: products
        });
    } catch (error) {
        console.log('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos'
        });
    }
};

const getProductById =  async(req, res) => {
    try {
        const {id} = req.params; //ruta es= /api/products/15
        const {data: product, error} = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

        if(error ||  !product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
        success: false,
        message: 'Error al obtner producto'
        });
        
    }
};

const createProduct = async (req, res) => {
    try {
        const {name, price, stock, category} =req.body;
        if(!name || price === undefined || stock === undefined){
            return res.status(400).json({
                success: false,
                message: 'Nombre, precio y stock son requeridos'
            });
        }

    const {data: product, error} = await supabase
        .from('products')
        .insert({
            name: name,
            price: price,
            stock: stock,
            category: category || null
        })
        // Select para que nos devuelva el producto que acabamos de insertar
        .select()
        .single()
        // Se pone single  para que solo devuelva UN solo producto y no todo
        if (error) {
            throw error;
        }
        //Creado //200 === Ok pesta correcto no problemas
                        //202 ---> Lo mande esta espera pero no esta lisa
                        // Accept --> 201 de que se creo el amigo 
                        // 200 solicitud de amistad aceptada
        res.status(201).json({
            success: true,
            message:'Poducto creado',
            product: product
        }); 

    } catch (error) {
        res.status(500).json({
        success: false,
        message: 'Error al crear el producto'
        });
    }
};

//Funcion: updateProduct
//Ruta: PUT /api/products/:id
// RECIBNE LOS PARAMETROS DEL OBJ PRODUCTO, Y ACTUALIZ

const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, price, stock, category} = req.body;
        const { data: product, error} = await supabase
        .from('products')
        .update({
            name: name,
            price: price,
            stock: stock,
            category: category || null
        })
        .eq('id', id)
        .select()
        .single();
        if (error){
            throw error;
        }
        if(!product){
            return res.status(404).json({
                success: false,
                message: 'Producto no enontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizao',
            product: product
        });

    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto'
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const { error} = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        
        if(error){
            throw error;
        }
        res.json({
            success: true,
            message: 'Producto eliminado',
        });
    } catch (error) {
        console.error('Error al eliminar el producto', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto'
        });
    }
};

// BUSCAR PRODUCTOS FUNCION: searchProducts
const searchProducts = async (req, res) => {
    try {
        const {q} = req.query;
        // Si no hay busqueda, retornar todo
        if(!q){
            return getAllProducts(req, res);
        }
        const { data: products, error} = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${q}%`) //WHERE name ILIKE // q= "lap"
            .order('name', {ascending: true});

            if(error){
                throw error;
            }
            res.json({
                success: true,
                products: products
            });
    } catch (error) {
        console.error('Error al buscar el producto', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar el producto'
        });
    }
};

// FUNCION: updateStock

//PATCH /api/prducts/:id/stock

//Recibe -> req.params.id = ID del producto
// req.body = {quantity: -5}

const updateStock = async (req, res) => {
    try {
        const{id} = req.params;
        const {quantity} = req.body;
        const{data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', id)
        .single();

        if(fetchError|| !product){
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }
        //Calcular nuevo stock
        const newStock = product.stock + quantity;

        if(newStock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock insuficiente'
            });
        }
        const {data: update, error: updateError} = await supabase
            .from('products')
            .update({stock: newStock})
            .eq('id', id)
            .select()
            .single();

            if(updateError) {
                throw updateError;
            }
            res.json({
                success: true,
                message: 'Stock actualizado',
                product: update
            });
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar stock'
        });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    updateStock
};