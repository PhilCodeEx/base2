new function(_){var JST=new base2.Namespace(this,{name:"JST",version:"0.9.1",exports:"Command, Environment, Interpreter, Parser"});eval(this.imports);var STDOUT=1;var Command=Base.extend({constructor:function(a){this[STDOUT]=[];this.extend(a)},echo:function(a){this[STDOUT].push(a)}});var Environment=Base.extend({set:function(a,b){this[a]=b},unset:function(a){delete this[a]}});var Interpreter=Base.extend({constructor:function(a,b){this.command=a||{};this.environment=new Environment(b);this.parser=new Parser},command:null,environment:null,parser:null,interpret:function(a){var b=new Command(this.command);var c=base2.namespace+"\nwith(arguments[0])with(arguments[1]){\n"+this.parser.parse(a)+"}\nreturn arguments[0][1].join('')";return new Function(c)(b,this.environment)}});var Escape=Module.extend({escape:function(b,c){if(b.escapeChar){var d=new RegExp(rescape(b.escapeChar+"."),"g");c=c.replace(d,function(a){return String.fromCharCode(Escape.BASE+a.charCodeAt(1))})}return c},unescape:function(b,c){if(b.escapeChar){c=c.replace(Escape.RANGE,function(a){return b.escapeChar+String.fromCharCode(a.charCodeAt(0)-Escape.BASE)})}return c}},{BASE:65280,RANGE:/[\uff00-\uffff]/g});var Parser=Base.extend({escapeChar:"\\",parse:function(a){return this._0(this._1(String(a)))},_0:function(c){var d=this._2;while(Parser.EVALUATED.test(c)){c=c.replace(Parser.EVALUATED,function(a,b){return d[b]})}delete this._2;return this.unescape(c)},_1:function(c){var d=/^=|;+$/g;var e=/<%[^%]*%([^>][^%]*%)*>/g;var f=this._2=[];var g=function(a){a=a.replace(Parser.TRIM,"");if(!a)return"";if(a.charAt(0)=="="){a="\necho("+a.replace(d,"")+");"}var b="\x01"+f.length+"\x01";f.push(a);return b};return Parser.TEXT.exec(this.escape(c).replace(e,g))}},{ESCAPE:new RegGrp({'\\\\':'\\\\','"':'\\"','\\n':'\\n','\\r':'\\r'}),EVALUATED:/\x01(\d+)\x01/g,TEXT:new RegGrp({"\\x01\\d+\\x01":RegGrp.IGNORE,"[^\\x01]+":function(a){return'\necho("'+Parser.ESCAPE.exec(a)+'");'}}),TRIM:/^<%\-\-.*\-\-%>$|^<%\s*|\s*%>$/g});Parser.implement(Escape);eval(this.exports)};