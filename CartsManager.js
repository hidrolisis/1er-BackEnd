import { existsSync, promises } from "fs";
import { productsManager } from "./ProductsManager.js";
const path = "CartsFile.json";

class CartsManager {
  async getCarts() {
    try {
      if (existsSync(path)) {
        const cartsFile = await promises.readFile(path, "utf-8");
        const cartsData = JSON.parse(cartsFile);
        return cartsData;
      } else {
        console.log("no existe el archivo");
        return [];
      }
    } catch (error) {
      console.log("error", error);
      return error;
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      let id;
      if (!carts.length) {
        id = 1;
      } else {
        id = carts[carts.length - 1].id + 1;
      }
      const newCart = { id, products: [] };
      carts.push(newCart);
      await promises.writeFile(path, JSON.stringify(carts));
      return newCart;
    } catch (error) {
      return error;
    }
  }

  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      console.log("carts", carts);
      const cart = carts.find((u) => u.id === id);
      console.log("cart", cart);
      return cart;
    } catch (error) {
      console.log("error catch");
      throw new Error(error.message);
    }
  }

  async addProductToCart(idCart, idProduct) {
    // validar carrito exista
    const cart = await this.getCartById(idCart);
    if (!cart) {
      throw new Error("There is no cart with this id");
    }
    // validar producto exista
    const product = await productsManager.getProductById(idProduct);
    if (!product) {
      throw new Error("There is no product with this id");
    }
    const productIndex = cart.products.findIndex(
      (p) => p.product === idProduct
    );
    if (productIndex === -1) {
      const newProduct = { product: idProduct, quantity: 1 };
      cart.products.push(newProduct);
    } else {
      cart.products[productIndex].quantity++;
    }
  }
}

export const cartsManager = new CartsManager();
