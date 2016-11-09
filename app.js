/**
 * Created by luis on 07/11/16.
 */
Vue.filter('doneLabel' , function (value) {
    if(value == 0){
        return "Não";
    }
    return "Sim";
});
var menuComponet = Vue.extend({
    template: `<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand">
                <img alt="Brand" src="assets/logo.png" width="22px" height="22px">
            </a>
        </div>
        <ul class="nav navbar-nav" v-for="menuObject in menu">
            <li id="{{ menuObject.id }}">
                <a @click.prevent="showView($event , menuObject.id )">{{ menuObject.name }}</a>
            </li>
        </ul>
    </div>
</nav>`,
    data: function(){
        return {
            menu: [
                {id: 0, name: "Listar contas"},
                {id: 1, name: "Criar Contas"},
            ],
        }
    },
    methods: {
        showView: function ($event, id) {
            this.$parent.menuView = id;
            this.$parent.action = "insert";
        },
    }
});
var listComponet = Vue.extend({
    template : `
       <div v-if="$parent.menuView == 0">
        <table class="table table-striped " border="0" cellpadding="10">
            <thead>
            <tr>
                <th>#</th>
                <th>Vencimento</th>
                <th>Nome</th>
                <th>valor</th>
                <th>Paga ?</th>
                <th class="text-center">Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="object in bills">

                <td><input type="checkbox" ></td>
                <td>{{ object.date_due }}</td>
                <td>{{ object.name }}</td>
                <td>{{ object.value | currency 'R$ ' }}</td>
                <td :class="{ isDone: object.done , notDone: !object.done }">{{ object.done | doneLabel }}</td>
                <td class="text-center">
                    <button class = "btn btn-primary"  @click="loadBill(object)">Editar</button>
                    <button class = "btn btn-danger"  @click="removeBill(object)">Excluir</button>
                </td>

            </tbody>

        </table>
        <div class="row" :class="{isDone: status == 0 , notDone : status > 0 }" >
            <div class="col-xs-2"  >{{ "Existem " + status +" para pagar ..." }}</div>
            <div class="col-xs-9" ><h1 class="text-right">{{ "Total : "}}{{ total | currency 'R$ '}}</h1></div>
        </div>
       </div>` ,
    data : function () {
        return {
            bills: [
                {date_due: "20/08/2016", name: "água", value: 10.00, done: 0},
                {date_due: "20/08/2016", name: "Luz", value: 10.00, done: 1},
                {date_due: "20/08/2016", name: "Telefones", value: 10.55, done: 0},
                {date_due: "20/08/2016", name: "Gasolina", value: 100.00, done: 0},
                {date_due: "20/08/2016", name: "cartão de crédito", value: 10.00, done: 0},
                {date_due: "20/08/2016", name: "luis Fernaod", value: 10.00, done: 1},
                {date_due: "20/08/2016", name: "luis Fernaod", value: 10.00, done: 0},
            ],

        }
    },
    computed: {
        status: function () {
            var count = 0;
            for (var i in this.bills) {

                if (!this.bills[i].done) {
                    count++;
                }
            }
            return count ;
        },
        total: function () {
            var value = 0;
            for (var i in this.bills) {

                if (!this.bills[i].done) {
                    value = value +  this.bills[i].value  ;
                }
            }
            return value ;
        },
    },
    methods :{
        loadBill : function (bill) {
            this.$parent.ction = 'update'
            this.$root.$children[0].$children[2].form = bill;
            this.$parent.menuView = 1;
        },
        removeBill : function ($object) {
            if(confirm("Deseja excluir esta conta ?")){
                this.bills.$remove($object);
            }
            this.$parent.menuView = 0;
        }
    }
});
var formComponet = Vue.extend({
    template : `
            <div v-if="$parent.menuView == 1">
                <form name="form" @submit.prevent="addBilss()" style="width:300px">
                    <div class="form-group">
                        <label>Nome</label>
                        <select class="form-control" v-model="form.name" >
                                <option {{value == form.name ?  : selected}} v-for="value in billType"  :value="value"  >{{ value }}</option>
                        </select>
                    </div>
        
                    <div class="form-group">
                        <label>Date</label>
                        <input class="form-control"type="text" v-model="form.date_due">
                    </div>
                    <div class="form-group">
                        <label>Value</label>
                        <input class="form-control"type="text" v-model="form.value">
        
                    </div>
                    <div class="form-group">
                        <label>Paga</label>
                        <input class="checkbox" type="checkbox" v-model="form.done" >
                    </div>
                    <button class = "btn btn-success" >Savlar</button>
                  </form>
            </div>` ,
     data: function(){
       return {
              action : "insert",
              form: {
                 name: "",
                 date: "",
                 value: "",
                 done : 0
              },
           billType: [
               "Luz" ,
               "Aluguel" ,
               "Alimentação" ,
               "Lazer",
               "Telefonia"
           ]
         }
        },
        methods: {
            addBilss: function () {
                if(this.action ==  "insert"){
                    console.log(this.$root.$children[0])
                    this.$root.$children[0].$children[1].bills.push(this.form);
                }
                this.form = {
                    name: "",
                    date: "",
                    value: "",
                    done : 0
                };
                this.$parent.menuView = 0;
            },
        },
})
var appComponet = Vue.extend({
    components: {
        "menu-componet"  : menuComponet,
        "list-componet" : listComponet,
        "form-componet" : formComponet,

    },
    template: `<menu-componet></menu-componet>
<div class="container">
    
       <list-componet></list-componet>
        <form-componet></form-componet>
  </div>`,
    data: function(){
        return {
            title: "Contas a Pagar",
            menuView: 0,

          }
        },
    methods: {}
});
Vue.component("app-componet" , appComponet);
var app = new Vue({
    el: "#app"
});