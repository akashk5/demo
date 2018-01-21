/**
 * Created by shridharp2 on 17-03-2016.
 */

var baseUrl = 'http://dmmapp.pcfdev.kpit.com/';

dmm.factory('dmmFactories', function($http){
    return{
        //---------- GET ALL EVENTS
        getAllEvents: function(){
            return $http({
                method: 'POST',
                url: baseUrl + 'dmm_get_event',
                data:
                {
                    "data": {
                        "event_id": "0"
                    }
                }
            })
        },

        //---------- GET EVENT DETAILS USING EVENT ID
        getEventDetails: function(payload){
            return $http({
                method: 'POST',
                url:  baseUrl + 'dmm_get_event_details',
                data: payload
            })
        },

        //---------- GET ALL TV LIST
        getAllTVs:function(){
            return $http({
                method: 'POST',
                url:  baseUrl + 'dmm_get_tvdetails'
            })
        },

        //---------- SET EVENT DETAILS
        setEvent:function(payload){
            return $http({
                method: 'POST',
                url:  baseUrl + 'dmm_set_eventdetails',
                data: payload
            })
        },

        //---------- SET IMAGE URL
        setImageUrl:function(payload){
            return $http({
                method: 'POST',
                url:  baseUrl + 'dmm_set_event_url',
                data: payload
            })
        },

        //---------- SET TV SCHEDULE
        setEventSchedule:function(payload){
            return $http({
                method: 'POST',
                url:  baseUrl + 'dmm_set_event_tv_datetime',
                data: payload
            })
        },

        //---------- GET TV EVENTS
        getTvEvents:function(payload){
            return $http({
                method: 'POST',
                url:  baseUrl + 'dmm_get_tvevents',
                data: payload
            })
        }
    }
});
