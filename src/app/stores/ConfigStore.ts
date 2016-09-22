let _config = {
  fontSize: 12,
  fontFamily: 'monospace',
  lineHeight: 14,
};

let ConfigStore = {

  getConfig: function() {
    return _config;
  },

  getLineWidth: function(line: string) {
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.font = _config.fontSize + 'px ' + _config.fontFamily;
    return ctx.measureText(line).width;
  },

};

export default ConfigStore;
