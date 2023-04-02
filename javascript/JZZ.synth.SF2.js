(function(global, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory.SF2 = factory;
    module.exports = factory;
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ.synth.SF2', ['JZZ'], factory);
  }
  else {
    factory(JZZ);
  }
})(this, function(JZZ) {

  /* istanbul ignore next */
  if (!JZZ) return;
  /* istanbul ignore next */
  if (!JZZ.synth) JZZ.synth = {};
  /* istanbul ignore next */
  if (JZZ.synth.SF2) return;

  var _version = '0.0.0';

  function Synth() {
    var self = this;
    self.play = function(msg) {
console.log(msg.toString());
    };
  }

  var _ac;
  function initAC() {
    if (!_ac) _ac = JZZ.lib.getAudioContext();
    return !!_ac;
  }

  var _synth = {};
  var _noname = [];
  var _engine = {};

  _engine._info = function(name) {
    if (!name) name = 'JZZ.synth.SF2';
    return {
      type: 'Web Audio',
      name: name,
      manufacturer: 'virtual',
      version: _version
    };
  };

  _engine._openOut = function(port, name) {
    initAC();
    /* istanbul ignore next */
    if (!_ac) {
      port._crash('AudioContext not supported');
      return;
    }
    var synth;
    if (typeof name !== 'undefined') {
      name = '' + name;
      if (!_synth[name]) _synth[name] = new Synth();
      synth = _synth[name];
    }
    else {
      synth = new Synth();
      _noname.push(synth);
    }
    synth.setAudioContext(_ac);
    port.plug = function(dest) {
      if (dest && (dest.context instanceof AudioContext || dest.context instanceof webkitAudioContext)) {
        synth.setAudioContext(dest.context, dest);
      }
    };
    port._info = _engine._info(name);
    port._receive = function(msg) { synth.send(msg); };
    port._resume();
  };

  JZZ.synth.SF2 = function(name) {
    return JZZ.lib.openMidiOut(name, _engine);
  };

  JZZ.synth.SF2.register = function(name) {
    return initAC() ? JZZ.lib.registerMidiOut(name, _engine) : false;
  };

  JZZ.synth.SF2.version = function() { return _version; };

});