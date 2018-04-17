module.exports = {
    "up": "CREATE TABLE `backend_reports`( `date` date NOT NULL, `machine_id` varchar(99) NOT NULL, `serial_no` varchar(99) DEFAULT NULL, `total_revenue` float DEFAULT NULL, `total_cash` float DEFAULT NULL, `total_credit_card` float DEFAULT NULL, `total_vat` float DEFAULT NULL, `total_vat_exempt` float DEFAULT NULL, `total_senior_citizen` float DEFAULT NULL, `zero_rated_sales` float DEFAULT NULL, `additional_discounts` float DEFAULT NULL, `void_sales` float DEFAULT NULL, PRIMARY KEY (`date`,`machine_id`), KEY `br_machine_id_idx` (`machine_id`), CONSTRAINT `br_machine_id` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`machine_id`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE=InnoDB DEFAULT CHARSET=utf8; ",
    "down": "DROP TABLE `backend_reports`"
}