/**
 * Created with PhpStorm.
 * User: Jake
 */

define([
	'jac/events/EventDispatcher',
	'jac/utils/ObjUtils',
	'jac/utils/DOMUtils',
	'jac/logger/Logger',
	'jac/utils/EventUtils',
	'app/AppConfig',
	'jac/events/JacEvent'
],
function(EventDispatcher,ObjUtils,DOMUtils,L,EventUtils,AppConfig,JacEvent){
    return (function(){
        /**
         * Creates a SettingsManager object
         * @extends {EventDispatcher}
         * @constructor
         */
        function SettingsManager($settingsSectionEl){
            //super
            EventDispatcher.call(this);

			var self = this;
			this._appConfig = new AppConfig();
			this._section = $settingsSectionEl;
			this._ipSettingsInput = DOMUtils.getChildById(this._section, 'ipSettingsInput');
			this._portSettingsInput = DOMUtils.getChildById(this._section, 'portSettingsInput');
			this._startListeningButton = DOMUtils.getChildById(this._section, 'startListeningButton');

			this._handleStartListeningClickDelegate = EventUtils.bind(self, self.handleStartListeningClick);
			this._startListeningButton.addEventListener('click', this._handleStartListeningClickDelegate);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(SettingsManager,EventDispatcher);
        var p = SettingsManager.prototype;

		p.handleStartListeningClick = function($clickEvt){
			L.log('Caught Start Listening Click', '@settings');
			this._appConfig.SOCKET_IP = this._ipSettingsInput.value;
			this._appConfig.SOCKET_PORT = parseInt(this._portSettingsInput.value);
			this.dispatchEvent(new JacEvent('settingsReadyEvent'));
		};

		p.exit = function(){
			DOMUtils.addClass(this._section, 'hiddenElement');
			this._section.parentNode.removeChild(this._section);
		};

		p.destroy = function(){
			L.log('Caught Destroy', '@settings');
			this._appConfig = null;
			this._section = null;
			this._ipSettingsInput = null;
			this._portSettingsInput = null;
			this._startListeningButton.removeEventListener('click', this._handleStartListeningClickDelegate);
			this._startListeningButton = null;
		};

        //Return constructor
        return SettingsManager;
    })();
});
