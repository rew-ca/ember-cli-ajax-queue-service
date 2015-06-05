import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({

    ajaxQueue: Ember.inject.service(),

    logs: Ember.A([]),

    url: '/api_v1/countries',

    actions: {

        start: function() {

            this.get('ajaxQueue').add(function() {
                this.logs.pushObject({message: 'start'});
                return ajax({
                    type: 'GET',
                    url: this.get('url'),
                    dataType: 'json'
                }).then(function() {
                    this.logs.pushObject({message: 'end'});
                    console.log('end', arguments);
                }.bind(this)).catch(function() {
                    this.logs.pushObject({message: 'end error'});
                    console.log('end error', arguments);
                }.bind(this));
            }.bind(this));


        }

    }

});
