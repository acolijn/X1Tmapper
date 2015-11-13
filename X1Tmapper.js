//  connect to the MongoDB to find all the PMT information you need
//code shared between client and server
Pmts = new Mongo.Collection("pmts");

if(Meteor.isServer){
    Meteor.publish("pmts", function(){
                   return Pmts.find();
                   });
}

TabularTables = {};

Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);

TabularTables.Pmts = new Tabular.Table({
                                       name: "PmtList",
                                       collection: Pmts,
                                       columns: [
                                                 {data: "PMT_Location", title: "PMT", tmpl: Meteor.isClient && Template.pmtCell
                                                 },
                                                 {data: "Top_Bottom", title: "Array"},
                                                 {data: "Amp_module", title: "Amp", tmpl: Meteor.isClient && Template.ampCell
                                                 },
                                                 {data: "Amp_channel", title: "ch#"},
                                                 {data: "ADC_module", title: "ADC", tmpl: Meteor.isClient && Template.adcCell},
                                                 {data: "ADC_channel", title: "ch#"},
                                                 {data: "HV_module", title: "HV",tmpl: Meteor.isClient && Template.hvCell},
                                                 {data: "HV_channel", title: "ch#"},
                                                 {data: "x", title: "x (cm)", searchable: false},
                                                 {data: "y", title: "y (cm)", searchable: false}
                                                 ]
                                       });

// client side functions
if(Meteor.isClient){
    Meteor.subscribe("pmts");
    
    Session.set("selectPMT",[]);
    
    Template.table.helpers({
                           selector: function (){
                             if (Session.get("selectPMT").length == 0) {
                               return ;
                             } else {
                               return{PMT_Location: {$in: Session.get("selectPMT")}};
                             }
                           }
                           });
    
    // clicking inside one table cell
    Template.ampCell.events({
                            'click .cell': function (event, t) {
                              if (Session.get("selectPMT").length != 0) {
                                Session.set("selectPMT",[]);
                                return;
                              }

                              var pmtsel   = Pmts.find({PMT_Location : this.PMT_Location}).fetch();
                              var selected = Pmts.find({Amp_module : pmtsel[0].Amp_module}).fetch();
                            
                              var pmtlist = []
                              for(i=0; i < selected.length; i++){
                                pmtlist.push(selected[i].PMT_Location);
                              }
                              Session.set("selectPMT",pmtlist);
                            }
                            });
    
    Template.adcCell.events({
                            'click .cell': function (event, t) {
                            if (Session.get("selectPMT").length != 0) {
                            Session.set("selectPMT",[]);
                            return;
                            }
                            var pmtsel   = Pmts.find({PMT_Location : this.PMT_Location}).fetch();
                            var selected = Pmts.find({ADC_module : pmtsel[0].ADC_module}).fetch();
                            
                            var pmtlist = []
                            for(i=0; i < selected.length; i++){
                            pmtlist.push(selected[i].PMT_Location);
                            }
                            Session.set("selectPMT",pmtlist);
                            
                            }
                            });
    
    Template.hvCell.events({
                           'click .cell': function (event, t) {
                           if (Session.get("selectPMT").length != 0) {
                           Session.set("selectPMT",[]);
                           return;
                           }
                           
                           var pmtsel   = Pmts.find({PMT_Location : this.PMT_Location}).fetch();
                           var selected = Pmts.find({HV_module : pmtsel[0].HV_module}).fetch();
                           
                           var pmtlist = []
                           for(i=0; i < selected.length; i++){
                           pmtlist.push(selected[i].PMT_Location);
                           }
                           Session.set("selectPMT",pmtlist);
                           
                           }
                           
                           });
    
    Template.pmtCell.events({
                            'click .cell': function (event, t) {
                            if (Session.get("selectPMT").length != 0) {
                            Session.set("selectPMT",[]);
                            return;
                            }
                            var pmtlist = [this.PMT_Location]
                            Session.set("selectPMT",pmtlist);
                            
                            }
                            
                            });
    
    
    Session.set('plotType', 'top');
    
    Template.drawPmts.helpers({
                              getType : function(){
                              return Session.get('plotType');
                              }
                              });
    
    // Just a reference for our canvas.
    var pmt_canvas;
    
    Meteor.startup( function(type) {
                   pmt_canvas = new PMT_Canvas();
                   // Creates a reactive context around us getting all points
                   // out of our points collection.
                   Deps.autorun(function() {
                                var data = Pmts.find({Top_Bottom: Session.get('plotType')}).fetch();
                                  if (pmt_canvas) {
                                    pmt_canvas.clear();
                                    pmt_canvas.draw(data,Session.get('plotType'));
                                  }
                                });
                   });
    
    
    // Another events hash.
    
    Template.pmt_canvas.events({
                           'click': function (event) {
                           
                           // toggle top and bottom array
                           if(Session.get('plotType') == 'bottom') {
                           Session.set('plotType', 'top');
                           } else {
                           Session.set('plotType', 'bottom');
                           }
                           
                           }
                           });
}


