const supabase = require('../config/supabase');

const login = async(req, res) => {
    try {
        const {username, password} =req.body;
        if(!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contrasenia son requeridos'
            });
        }

        //Buscar usuario en supabase
        const{data: user, error} = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

        if(error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales invalidas'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });

    }catch(error){
        console.log('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });

    }

};

const getUsers = async (req, res) => {
   try {
    const {data: users, error} = await supabase
    .from('users')
    .select('id, username, name, role, created_at')
    .order('id', {ascending: true});
    if (error){
        throw error;
    }
    res.json({
        success: true,
        users: users
    });
    
   } catch (error){
        console.error('Error al obtener usuarios', error);
        res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios'    
        });
        
   }
};

module.exports = {
    login,
    getUsers
};