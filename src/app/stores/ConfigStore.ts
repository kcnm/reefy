let _config = {
  fontSize: 12,
  fontFamily: 'monospace',
  lineHeight: 14,
  tabSize: 4,
};

let ConfigStore = {

  getConfig: function() {
    return _config;
  },

  getLineWidth: function(line: string) {
    let ctx = document.createElement('canvas').getContext('2d');
    ctx.font = _config.fontSize + 'px ' + _config.fontFamily;
    return ctx.measureText(this.expand(line)).width;
  },

  expand: function(line: string) {
    let segments = line.split('\t');
    let result = segments[0];
    for (let seg of segments.slice(1)) {
      let shift = result.length % _config.tabSize
      if (shift > 0) {
        result += new Array(_config.tabSize - shift + 1).join(' ');
      }
      result += seg;
    }
    return result;
  },

};

export default ConfigStore;
