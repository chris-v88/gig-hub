var DataTypes = require("sequelize").DataTypes;
var _Categories = require("./Categories");
var _Chat = require("./Chat");
var _Chat_messages = require("./Chat_messages");
var _Gig_images = require("./Gig_images");
var _Gigs = require("./Gigs");
var _Languages = require("./Languages");
var _Order_deliveries = require("./Order_deliveries");
var _Orders = require("./Orders");
var _Reviews = require("./Reviews");
var _Subcategories = require("./Subcategories");
var _User_certifications = require("./User_certifications");
var _User_languages = require("./User_languages");
var _User_skills = require("./User_skills");
var _Users = require("./Users");

function initModels(sequelize) {
  var Categories = _Categories(sequelize, DataTypes);
  var Chat = _Chat(sequelize, DataTypes);
  var Chat_messages = _Chat_messages(sequelize, DataTypes);
  var Gig_images = _Gig_images(sequelize, DataTypes);
  var Gigs = _Gigs(sequelize, DataTypes);
  var Languages = _Languages(sequelize, DataTypes);
  var Order_deliveries = _Order_deliveries(sequelize, DataTypes);
  var Orders = _Orders(sequelize, DataTypes);
  var Reviews = _Reviews(sequelize, DataTypes);
  var Subcategories = _Subcategories(sequelize, DataTypes);
  var User_certifications = _User_certifications(sequelize, DataTypes);
  var User_languages = _User_languages(sequelize, DataTypes);
  var User_skills = _User_skills(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Gigs.belongsTo(Categories, { as: "category", foreignKey: "category_id"});
  Categories.hasMany(Gigs, { as: "Gigs", foreignKey: "category_id"});
  Subcategories.belongsTo(Categories, { as: "category", foreignKey: "category_id"});
  Categories.hasMany(Subcategories, { as: "Subcategories", foreignKey: "category_id"});
  Chat_messages.belongsTo(Chat, { as: "thread", foreignKey: "thread_id"});
  Chat.hasMany(Chat_messages, { as: "Chat_messages", foreignKey: "thread_id"});
  Gig_images.belongsTo(Gigs, { as: "gig", foreignKey: "gig_id"});
  Gigs.hasMany(Gig_images, { as: "Gig_images", foreignKey: "gig_id"});
  Orders.belongsTo(Gigs, { as: "gig", foreignKey: "gig_id"});
  Gigs.hasMany(Orders, { as: "Orders", foreignKey: "gig_id"});
  Reviews.belongsTo(Gigs, { as: "gig", foreignKey: "gig_id"});
  Gigs.hasMany(Reviews, { as: "Reviews", foreignKey: "gig_id"});
  User_languages.belongsTo(Languages, { as: "language", foreignKey: "language_id"});
  Languages.hasMany(User_languages, { as: "User_languages", foreignKey: "language_id"});
  Chat.belongsTo(Orders, { as: "order", foreignKey: "order_id"});
  Orders.hasMany(Chat, { as: "Chats", foreignKey: "order_id"});
  Order_deliveries.belongsTo(Orders, { as: "order", foreignKey: "order_id"});
  Orders.hasMany(Order_deliveries, { as: "Order_deliveries", foreignKey: "order_id"});
  Reviews.belongsTo(Orders, { as: "order", foreignKey: "order_id"});
  Orders.hasMany(Reviews, { as: "Reviews", foreignKey: "order_id"});
  Gigs.belongsTo(Subcategories, { as: "subcategory", foreignKey: "subcategory_id"});
  Subcategories.hasMany(Gigs, { as: "Gigs", foreignKey: "subcategory_id"});
  Chat.belongsTo(Users, { as: "participant1", foreignKey: "participant1_id"});
  Users.hasMany(Chat, { as: "Chats", foreignKey: "participant1_id"});
  Chat.belongsTo(Users, { as: "participant2", foreignKey: "participant2_id"});
  Users.hasMany(Chat, { as: "participant2_Chats", foreignKey: "participant2_id"});
  Chat_messages.belongsTo(Users, { as: "sender", foreignKey: "sender_id"});
  Users.hasMany(Chat_messages, { as: "Chat_messages", foreignKey: "sender_id"});
  Gigs.belongsTo(Users, { as: "seller", foreignKey: "seller_id"});
  Users.hasMany(Gigs, { as: "Gigs", foreignKey: "seller_id"});
  Orders.belongsTo(Users, { as: "seller", foreignKey: "seller_id"});
  Users.hasMany(Orders, { as: "Orders", foreignKey: "seller_id"});
  Orders.belongsTo(Users, { as: "buyer", foreignKey: "buyer_id"});
  Users.hasMany(Orders, { as: "buyer_Orders", foreignKey: "buyer_id"});
  Reviews.belongsTo(Users, { as: "reviewer", foreignKey: "reviewer_id"});
  Users.hasMany(Reviews, { as: "Reviews", foreignKey: "reviewer_id"});
  Reviews.belongsTo(Users, { as: "reviewee", foreignKey: "reviewee_id"});
  Users.hasMany(Reviews, { as: "reviewee_Reviews", foreignKey: "reviewee_id"});
  User_certifications.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(User_certifications, { as: "User_certifications", foreignKey: "user_id"});
  User_languages.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(User_languages, { as: "User_languages", foreignKey: "user_id"});
  User_skills.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(User_skills, { as: "User_skills", foreignKey: "user_id"});

  return {
    Categories,
    Chat,
    Chat_messages,
    Gig_images,
    Gigs,
    Languages,
    Order_deliveries,
    Orders,
    Reviews,
    Subcategories,
    User_certifications,
    User_languages,
    User_skills,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
