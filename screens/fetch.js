
const query = `
  query {
    bookById( id: "book-1" ) { 
    id 
    name 
    pageCount
    } 
  }
`;

const url = "http://10.108.162.233:8080/graphql/";
const opts = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query })
};



  componentDidMount(){
    return fetch("http://10.108.162.233:8080/graphql/",  {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    })
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }


  
export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  //SettingsStack,
},{
  tabBarOptions: {
    activeTintColor: Colors.grisOscuro,
    style: {
      backgroundColor: Colors.grisClaro,
    },
  },
});