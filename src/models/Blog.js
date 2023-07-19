module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageURL: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      videoURL: {
        type: DataTypes.STRING,
      },
      keyword: {
        // varchar
        type: DataTypes.STRING,
        allowNull: false,
      },
      countryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      //   created dan updatedAt sudah otomatis
    },
    {
      freezeTableName: true,
      timestamps: true,
      // I don't want updatedAt
      updatedAt: false,
    }
  );

  Blog.associate = (models) => {
    Blog.belongsTo(models.User, { foreignKey: "userId" });
    Blog.belongsTo(models.Country, { foreignKey: "countryId" });
    Blog.belongsTo(models.Category, { foreignKey: "categoryId" });
  };

  return Blog;
};
