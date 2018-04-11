var express = require('express');
var router = express.Router();
var Role = require('../models/Role');

// MIDDLEWARE
var RolesMW = require('../middlewares/RolesMW');
const { getRoleList, countRoles } = RolesMW;

router.get('/:id?', function (req, res, next) {

  if (req.params.id) {

    Role.getRoleById(req.params.id, function (err, rows) {

      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }
    });
  } else {

    Role.getAllRoles(function (err, rows) {

      if (err) {
        res.json(err);
      } else {
        res.json(rows);
      }

    });
  }
});

router.get('/getRolesByCountry/:id?', function (req, res, next) {

    if (req.params.id) {
  
      Role.getRolesByCountryId(req.params.id, function (err, rows) {
  
        if (err) {
          res.json(err);
        } else {
          res.json(rows);
        }
      });
    } 
  });

router.post('/', function (req, res, next) {

  Role.addRole(req.body, function (err, count) {
    if (err) {
      res.json(err);
    } else {
      res.json(req.body); //or return count for 1 &amp;amp;amp; 0
    }
  });
});
router.delete('/:id', function (req, res, next) {

  Role.deleteRole(req.params.id, function (err, count) {

    if (err) {
      res.json(err);
    } else {
      res.json(count);
    }

  });
});
router.put('/:id', function (req, res, next) {

  Role.updateRole(req.params.id, req.body, function (err, rows) {

    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});

router.post('/getRoleList/', getRoleList, countRoles);
module.exports = router;