const supabase = require('../config/supabase');


const getAllSales = async (req, res) => {
  try {
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('*')
      .order('id', { ascending: false });

    if (salesError) throw salesError;

    const salesWithItems = await Promise.all(
      sales.map(async (sale) => {
        const { data: items, error: itemsError } = await supabase
          .from('sale_items')
          .select('*')
          .eq('sale_id', sale.id);

        if (itemsError) {
          console.error('Error al obtener items:', itemsError);
          return { ...sale, items: [] };
        }

        return {
          id: sale.id,
          subtotal: parseFloat(sale.subtotal),
          taxRate: parseFloat(sale.tax_rate),
          taxAmount: parseFloat(sale.tax_amount),
          total: parseFloat(sale.total),
          userId: sale.user_id,
          date: sale.created_at,
          items: items.map((item) => ({
            productId: item.product_id,
            name: item.product_name,
            price: parseFloat(item.price),
            quantity: item.quantity,
          })),
        };
      })
    );

    res.json({
      success: true,
      sales: salesWithItems,
    });

  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas',
    });
  }
};


const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();

    if (saleError || !sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada',
      });
    }

    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', id);

    if (itemsError) throw itemsError;

    res.json({
      success: true,
      sale: {
        id: sale.id,
        subtotal: parseFloat(sale.subtotal),
        taxRate: parseFloat(sale.tax_rate),
        taxAmount: parseFloat(sale.tax_amount),
        userId: sale.user_id,
        date: sale.created_at,
        items: items.map((item) => ({
          productId: item.product_id,
          name: item.product_name,
          price: parseFloat(item.price),
          quantity: item.quantity,
        })),
      },
    });

  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener venta',
    });
  }
};


const createSale = async (req, res) => {
  try {
    const { subtotal, taxRate, taxAmount, userId, items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La venta debe incluir al menos un item',
      });
    }
    if (subtotal === undefined || total ===undefined) {
      return res.status(400).json({
        success: false,
        message: 'Subtotal y total son requeridos'
      });
    }

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        subtotal: subtotal,
        tax_rate: taxRate || 13,
        tax_amount: taxAmount,
        total: total,
        user_id: userId || null
      })
      .select()
      .single();

      if(saleError) {
        throw saleError;
      }
      // Paso 2: Crear Los items de la venta
      const saleItems = items.map((item) => ({
      sale_id: sale.id,
      product_id: item.productId,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) throw itemsError;

    //Paso 3 Actualizar el stock de cada producto
    for (const item of items) {
      //obtner stock
      const {data: product, error: fetchError} = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.productId)
        .single();

      if (fetchError){
        console.error(`Error al obtener producto ${item.productId}:`,fetchError);
        continue;
      }
      // Calcular nuevo stock
      const newStock = product.stock - item.quantity;
      // Actualizamos stock
      const {error: updateError} = await supabase
      .from('products')
      .update({stock: Math.max(0, newStock)})
      .eq('id', item.productId);
      if(updateError){
        console.error(`Error al actualizar stock de ${item.productId}:` ,updateError);
      }
    }
    // Se hizo la peticion correctamente y se actualizo ===201
    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      sale: {
        id: sale.id,
        subtotal: parseFloat(sale.subtotal),
        taxRate: parseFloat(sale.tax_rate),
        taxAmount: parseFloat(sale.tax_amount),
        total: parseFloat(sale.total),
        date: sale.created_at,
          items: items
      }
    });

  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear venta',
    });
  }
};

// RUTA: GET/ api/sales/stats

//Calcular la stats

// Que retornar? ===
//{succes: true, stats: {totalSales: 123123, totalTax: 160, transactionCount: 45}}
const getSalesStats = async (req, res) => {
  try {
    const {data: sales, error } = await supabase
    .from('sales')
    .select('total, tax_amount')
    if(error){
      throw error;
    }
    const stats = {
      totalSales: sales.reduce((sum,sale)=> sum + parseFloat(sale.total),0),
      //sales: Es tu arreglo
        //.reduce(...) Es un orden que da JS recorre cada elementa de esta lista
        //uno por uno y haz una operacion para entregarme un solo resultado
        //(sum, sale) => Es la función que se ejecuta por cada elemento de la lista
        //sum El acumulador de la caja registradora y me guarda el total acumulado
        //sale es el recibo o producto invidual que te entrega la funcion
        //sum + parsefloat es la operacion le dice a JS toma lo que ya tengo guardado
        //en sum y sumale el valor de total
        //O pongo cero por le digo a la cajera que empiece a contar desde cero antes de
        //el primer producto
        totalTax: sales.reduce((sum, sale) => sum +  parseFloat(sale.tax_amount),0),
        //totaltax es el nombre de la propieda que estamos creando dentro del objeto
        //stats aqui voya a guarda el resultado final (el total de los impuesto)
        //sale.reduce vuelvo a tomar el mismo array de ventas (sales) y lo recorro uno a uno
        //sum, sale +> ...Sigue siendo un acumulador (como el de la caja) 
        transactionCount: sales.length
    };
    res.status(200).json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de ventas',
    });
  }
}
module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  getSalesStats
};