import { View, Text } from "react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import Url from "../../../services/API";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";
import OrderItem from "../../../components/Item/OrderItem";

const OrderHistory = ({ navigation }) => {
  const [loading, isLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getOrderHistory();
  }, []);
  const totalPrice = (item) => {
    const value = item.reduce((total, item) => {
      return (total += item.productPrice * item.quantity);
    }, 0);
    return value;
  };
  const getOrderHistory = async () => {
    try {
      const res = await fetch(
        `${Url}/order-history/${await getIdUserLogin()}`
      );
      if (res.status === 200) {
        const json = await res.json();
        setData(json.data);
        console.log(json);
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading(false);
    }
  };

  const getIdUserLogin = async () => {
    try {
      const info = await AsyncStorage.getItem("Data");
      const data = await JSON.parse(info);
      if (data) {
        return data.id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 15,
        width: "100%",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 1, marginTop: 40, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/130/130882.png",
              }}
              style={{ width: 20, height: 20 }}
              resizeMode="stretch"
            />
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold" }}>ORDER HISTORY</Text>
          <TouchableOpacity>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/62/62025.png",
              }}
              style={{ width: 20, height: 20, tintColor: "green" }}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>
        <View style={{marginVertical: 10}}></View>
        <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DetailOrder", {
                data: item.item,
                shipping: item.shipping,
                code: item._id,
                address : item.item[0].address
              })
            }
          >
            <OrderItem
              totalPrice={totalPrice(item.item) + item.shipping}
              status={item.status}
              date={item.updatedAt}
              cartId={item.item}
              id={item._id}
            />
          </TouchableOpacity>
        )}
      />
      </View>
    
    </View>
  );
};

export default OrderHistory;
