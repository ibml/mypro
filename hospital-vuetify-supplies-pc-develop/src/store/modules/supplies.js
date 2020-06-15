import {
    setStore,
    getStore
} from '@/utils/storage'
/**
 * 领导要求要把申领车永久存于本地
 */
import AuthenticationService from "@/services/AuthenticationService";
var CurUserCode = AuthenticationService.getCurrentUser() && AuthenticationService.getCurrentUser().userInfo.user_code ? AuthenticationService.getCurrentUser().userInfo.user_code : '';

const state = {
    cartList: [], // 加入购物车列表
}

const getters = {
    cartListCount: state => {
        return state.cartList.length;
    }
}

const mutations = {

    // 网页初始化时从本地缓存获取购物车数据
    "INIT_APPLYCART"(state) {
         CurUserCode = AuthenticationService.getCurrentUser() && AuthenticationService.getCurrentUser().userInfo.user_code ? AuthenticationService.getCurrentUser().userInfo.user_code : '';
        if (CurUserCode) {
            let initCart = getStore(CurUserCode)
            if (initCart) {
                state.cartList = JSON.parse(initCart)
            }
        } else {
            state.cartList = []
        }
    },
    // 加入购物车
    //商品编码 ，商品单价， 商品名称 ，商品规格 ，商品库存 生产厂家 ,中包数量  商品数量
    "ADD_CART"(state, applyItem) {
        let cart = state.cartList // 购物车
        let falg = true
        let goods =Object.assign({},applyItem)
        if (cart.length) { // 有内容
            cart.forEach(item => {
                if (item.gcode === goods.gcode) {
                    if (item.qty >= 0) {
                        falg = false
                        item.qty += goods.qty
                    }
                }
            })
        }
        if (!cart.length || falg) {
            //不需要再赋值数量，因为传进来仅有了
            goods.checked = '1'
            cart.push(goods)
        }
        state.cartList = cart
        // 存入localStorage
        setStore(CurUserCode, cart)
    },
    // 每次商品+1
    "PLUS_CART"(state, {
        gcode
    }) {
        let cart = state.cartList
        cart.forEach((item, i) => {
            if (item.gcode === gcode) {
                item.qty += 1;
            }
        })
        state.cartList = cart
        // 存入localStorage
        setStore(CurUserCode, state.cartList)
    },
    // 每次商品-1
    "REDUCE_CART"(state, {
        gcode
    }) {
        let cart = state.cartList
        cart.forEach((item, i) => {
            if (item.gcode === gcode) {
                if (item.qty > 1) {
                    item.qty--
                } else {
                    cart.splice(i, 1)
                }
            }
        })
        state.cartList = cart
        // 存入localStorage
        setStore(CurUserCode, state.cartList)
    },
    // 移除商品
    "SPLICE_CART"(state, {
        gcode
    }) {
        let cart = state.cartList
        cart.forEach((item, i) => {
            if (item.gcode === gcode) {
                cart.splice(i, 1)
            }
        })
        state.cartList = cart
        // 存入localStorage
        setStore(CurUserCode, state.cartList)
    },
}

const actions = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}