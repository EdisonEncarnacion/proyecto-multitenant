// src/middleware/tenant.js
const adminDB = require('../config/dbAdmin');
const connectToTenant = require('../config/dbTenant');

let tenantConnections = {};

const useTenant = async (req, res, next) => {
  const tenant = req.headers['tenant'];

  if (!tenant) return res.status(400).json({ error: 'Tenant no especificado' });

  if (!tenantConnections[tenant]) {
    const [results] = await adminDB.query(
      `SELECT * FROM tenants WHERE name = ?`,
      { replacements: [tenant] }
    );

    if (!results.length) return res.status(404).json({ error: 'Tenant no encontrado' });

    const tenantInfo = results[0];
    tenantConnections[tenant] = connectToTenant(tenantInfo.db_name, tenantInfo.db_user, tenantInfo.db_password);
  }

  req.db = tenantConnections[tenant];
  console.log('🔍 Conectando a tenant:', tenantConnections[tenant].config.database);
  next();
};

module.exports = useTenant;
