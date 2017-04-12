var m = require("mithril");
var root = document.body;

class Menu {
  view() {
    return (
      <div>Menu:
        <a href="/#/">Customers</a>
      </div>
    );
  }
}

class CustomerService {
  customers = [];
  getCustomers() {
    // Comment out below to load customers every time
    if (this.customers.length != 0) {
      return new Promise((resolve, reject) => {
        resolve(this.customers)
      });
    }

    return m.request({method: "GET", url: "/customers"}).then((response) => {
      this.customers = response;
      return response;
    });
  }

  getCustomer(id) {
    return m.request({
      method: "GET",
      url: "/customers/" + id
    }).then((response) => {
      return response;
    });
  }

  addCustomer(name, city) {
    return m.request({
      method: "POST",
      url: "/customers",
      data: {
        name: name,
        city: city
      }
    }).then((response) => {
      return response;
    });
  }
}
var customerService = new CustomerService();
var status = "";

class CustomerList {
  oninit() {
    customerService.getCustomers().then((result) => {
      status = "successfully loaded customer list";
    }).catch((reason) => {
      status = "error: " + reason;
    });
  }

  view() {
    var listItems = customerService.customers.map((customer) => {
      return (
        <li key={customer.id}>
          <a href={"/#!/customer/" + customer.id}>{customer.name}</a>
        </li>
      );
    });
    return (
      <div>status: {status}<br/>
        <ul>{listItems}</ul>
        <form onsubmit={this.onNewCustomer}>
          <label>Name:<input type="text" name="name" value={this.name}/></label>
          <label>City:<input type="text" name="city" value={this.city}/></label>
          <input type="submit" value="New Customer"/>
        </form>
      </div>
    );
  }

  onNewCustomer(event) {
    event.preventDefault();
    console.log("onNewCustomer");
    customerService.addCustomer(this.name.value, this.city.value).then((result) => {
      customerService.customers.push({id: result, name: this.name.value, city: this.city.value});
      status = "successfully added new customer";
    }).catch((reason) => {
      status = "error: " + reason;
    });
  }
}

class App {
  view() {
    return m(".app", [m(Menu), m(CustomerList)]);
  }
};

class CustomerDetails {
  customer = {};

  oninit(vnode) {
    customerService.getCustomer(vnode.attrs.id).then((result) => {
      status = "successfully loaded customer details";
      this.customer = result;
    }).catch((reason) => {
      status = "error: " + reason;
    });
  }
  view() {
    return m(".app", [m(Menu), (
        <div>status: {status}
          <ul>
            <li>name: {this.customer.name}</li>
            <li>city: {this.customer.city}</li>
          </ul>
        </div>
      )]);
  }
};

m.route(root, "/", {
  "/": App,
  "/customer/:id": CustomerDetails
});
