(function() {

    var test = {};

    var P = window.parachute = {

        needed: null,
        fills: null,
        extLibLoaded: false,
        failed: [],

        init: function(needed, fills) {

            var def = this.default;

            needed = needed || def.needed;

            /* First, check for Array.forEach (we need it for the fill function */
            /*
            if (!Array.prototype.forEach)
                Array.prototype.forEach = this.fills.forEach;
                */

            /* Now, fill missing things */
            this.fills = fills || def.fills
            this.fill(needed);

            return this.failed;

        },

        loadExtLib: function(callback) {

            var self = this,
                script,
                timer;

            if (this.extLibLoaded) {
                callback();
                return;
            }

            script = document.createElement('script'),
            script.src = '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js';
            document.body.appendChild(script)

            var timer = window.setInterval(function() {

                if (window.jQuery) {

                    window.clearInterval(timer);
                    self.extLibLoaded = true;
                    callback();

                }

            });

        },

        check: function(str) {

            if ( (new Function('return ' + str))() !== undefined)
                return true;

        },

        fillOne: function(what) {

            var self = this;

                if (!this.check(what)) {

                    this.loadExtLib(function() {

                        $('body');                
                        if (self.fills[what])
                            console.log('Filled ' + what);
                        else
                            self.failed.push(what);

                        what = self.fills[what];

                    });

                }

        },

        fillMany: function(arr) {

            var item = arr.shift();

            this.fillOne(item);

            if (arr.length > 0)
                this.fillMany(arr);

        },

        fill: function(what) {

            var t = typeof what;

            if (t === 'string')
                return this.fillOne(what);

            if (t === 'object')
                return this.fillMany(what);

            if (t === 'function');
                throw new Error('Unsupported atribute');
            
        },

        default: {

            needed: [
                
                'document.querySelector',
                'document.querySelectorAll'

            ],


            fills: {

                'document.test': function() { return true; },

                forEach: function(fn, scope) {

                    var item,
                    l = this.length,
                    i = 0;

                    while ( i < l ) {
                        fn.call(scope, this[i], i, this);
                        i++;
                    }

                }

            }

        }

    };

})();
