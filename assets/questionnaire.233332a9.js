var g=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function j(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function M(r){var o=r.default;if(typeof o=="function"){var u=function(){return o.apply(this,arguments)};u.prototype=o.prototype}else u={};return Object.defineProperty(u,"__esModule",{value:!0}),Object.keys(r).forEach(function(w){var _=Object.getOwnPropertyDescriptor(r,w);Object.defineProperty(u,w,_.get?_:{enumerable:!0,get:function(){return r[w]}})}),u}var D={},I={},A={};(function(r){Object.defineProperty(r,"__esModule",{value:!0}),r.ValidationIssueLevel=r.ContentChangeSource=r.AnswerType=void 0,function(o){o[o.UNKNOWN=0]="UNKNOWN",o[o.NONE=1]="NONE",o[o.TEXT=2]="TEXT",o[o.NUMBER=3]="NUMBER",o[o.RADIO=4]="RADIO",o[o.SELECT=5]="SELECT",o[o.CHECKBOX=6]="CHECKBOX",o[o.DATE=7]="DATE",o[o.TIME=8]="TIME",o[o.DATETIME=9]="DATETIME",o[o.DATE_RANGE=10]="DATE_RANGE",o[o.TIME_RANGE=11]="TIME_RANGE",o[o.DATETIME_RANGE=12]="DATETIME_RANGE",o[o.TEXTAREA=13]="TEXTAREA"}(r.AnswerType||(r.AnswerType={})),function(o){o[o.Reset=0]="Reset",o[o.User=1]="User"}(r.ContentChangeSource||(r.ContentChangeSource={})),function(o){o[o.INFO=0]="INFO",o[o.WARNING=1]="WARNING",o[o.ERROR=2]="ERROR"}(r.ValidationIssueLevel||(r.ValidationIssueLevel={}))})(A);(function(r){var o=g&&g.__spreadArray||function(n,t,e){if(e||arguments.length===2)for(var i=0,s=t.length,a;i<s;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return n.concat(a||Array.prototype.slice.call(t))};Object.defineProperty(r,"__esModule",{value:!0}),r.get_type_name=r.as_items=r.as_options=r.as_answers=r.Option=r.Answer=r.AnswerValidatorsWithProps=r.AnswerValidators=r.answer_validator=r.ItemValidators=r.ItemValidatorsWithProps=r.item_validator=r.Item=r.CounterSet=r.Counter=r.Questionnaire=void 0;var u=A,w=function(){function n(t){if(this._data=void 0,this.item_history=[],this.validation_issues=[],!t.name)throw"Questionnaire must have a name";if(this.name=t.name,!t.introduction)throw"Questionnaire must have a description";if(this.introduction=t.introduction,this.citation=typeof t.citation=="string"?t.citation:"",this.version=typeof t.version=="string"?t.version:"",this.items=(0,r.as_items)(t.items),this.onComplete=t.onComplete,this.counters=new d(this),this.reset_items_on_back=!!t.reset_items_on_back,!this.items.length)throw"Questionnaire requires at least one item";this.current_item=this.items[0]}return n.prototype.next_q=function(){if(typeof this.current_item>"u")throw"Cannot process next_q for undefined current_item [".concat(this.item_history.map(function(e){return e.id}),"]");this.current_item.handleAnswer(this.current_item.last_changed_answer,this.current_item,this),this.item_history.push(this.current_item);var t=this.current_item.check_validation(this);if(t.length){console.warn.apply(console,o(["Cannot proceed for the following reasons:"],t,!1));return}this.current_item=this.current_item.next_item(this.current_item.last_changed_answer,this.current_item,this),this.current_item||this.onComplete(this)},n.prototype.last_q=function(){this.reset_items_on_back&&typeof this.current_item<"u"&&this.current_item.answers.forEach(function(e){return e.reset_content()});var t=this.item_history.pop();if(!t){console.warn("No history to go_back to.");return}this.counters.revert(t),this.current_item=t},n.prototype.getItemById=function(t){var e,i=this.items.find(function(s){return s.id===t});if(!i)throw"[".concat((e=this.current_item)===null||e===void 0?void 0:e.id,"] Cannot find item with id ").concat(t);return i},Object.defineProperty(n.prototype,"data",{get:function(){return this._data},set:function(t){this._data=t},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"next_item_in_sequence_id",{get:function(){if(!(this.current_item instanceof h))throw"Cannot determine next item from undefined item";var t=this.items.indexOf(this.current_item);return this.items.length<=t+1?null:this.items[t+1].id},enumerable:!1,configurable:!0}),n.prototype.check_validation=function(){var t=this,e=[];return this.items.forEach(function(i){return e.push.apply(e,i.check_validation(t))}),this.validation_issues=e,this.validation_issues},n}();r.Questionnaire=w;var _=function(){function n(t,e){if(e===void 0&&(e=0),this._operations=[],!t.length)throw"A Counter must have a name";this._name=t,this._initial_content=e}return Object.defineProperty(n.prototype,"name",{get:function(){return this._name},set:function(t){this._name=t},enumerable:!1,configurable:!0}),n.prototype.set_content=function(t,e){this._operations.push({owner:e,operation:function(){return t}})},Object.defineProperty(n.prototype,"content",{get:function(){var t=this._initial_content;return this._operations.forEach(function(e){return t=e.operation(t)}),t},enumerable:!1,configurable:!0}),n.prototype.increment_content=function(t,e){this._operations.push({owner:e,operation:function(i){return i+t}})},n.prototype.revert=function(t){this._operations=this._operations.filter(function(e){return e.owner!==t})},n}();r.Counter=_;var d=function(){function n(t){this.counters=[],this._state=t}return n.prototype._find_counter=function(t){var e=this.counters.find(function(i){return i.name===t});if(!e)throw"No counter found named ".concat(t);return e},n.prototype._create_counter=function(t,e){var i=new _(t,e);return this.counters.push(i),i},n.prototype.get=function(t,e){e===void 0&&(e=null);try{return this._find_counter(t).content}catch(i){if(e!==null)return e;throw i}},n.prototype.set=function(t,e,i){if(!i)if(this._state.current_item)i=this._state.current_item;else throw"Cannot determine counter operation source";var s;try{s=this._find_counter(t)}catch{s=this._create_counter(t,e)}s.set_content(e,i)},n.prototype.increment=function(t,e,i){if(e===void 0&&(e=1),!i)if(this._state.current_item)i=this._state.current_item;else throw"Cannot determine counter operation source";var s;try{s=this._find_counter(t),s.increment_content(e,i)}catch{s=this._create_counter(t,e)}},n.prototype.revert=function(t){this.counters.forEach(function(e){return e.revert(t)})},n}();r.CounterSet=d;var h=function(){function n(t){if(this.validators=[],this.own_validation_issues=[],this.validation_issues=[],!t.id)throw"An Item must have an id";if(this.id=t.id,!t.question)throw"An Item must have a question";this.question=t.question,this.validators=t.validators||[],this.handleAnswer=t.process_answer_fun||function(){},t.next_item_fun?(this.getNextItemId=t.next_item_fun,this.conditional_routing=!0):(t.next_item===!1?this.getNextItemId=function(){return null}:t.next_item===null||t.next_item===void 0?this.getNextItemId=function(i,s,a){return a.next_item_in_sequence_id}:this.getNextItemId=function(){return t.next_item},this.conditional_routing=!1);var e=t.answers?(0,r.as_answers)(t.answers,this.id):[];this.answers=e instanceof Array?e:[e]}return n.prototype.next_item=function(t,e,i){var s=this.getNextItemId(t,e,i);if(s!==null){var a=i.items.find(function(c){return c.id===s});if(!a)throw"Cannot find next_item with id ".concat(s);return a}},Object.defineProperty(n.prototype,"answer",{get:function(){if(this.answers.length!==1)throw"Property 'answer' can only be used where answers.length === 1";return this.answers[0]},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"last_changed_answer",{get:function(){var t=null,e=new Date(0);if(this.answers.forEach(function(i){i.last_answer_utc_time&&new Date(i.last_answer_utc_time)>e&&(t=i,e=new Date(i.last_answer_utc_time))}),t)return t},enumerable:!1,configurable:!0}),n.prototype.check_validation=function(t,e){var i=this;if(e===void 0&&(e=!0),t.validation_issues=t.validation_issues.filter(function(a){return!("item_id"in a)||a.item_id!==i.id}),this.validation_issues=this.validation_issues.filter(function(a){return!("item_id"in a)||a.item_id!==i.id}),this.own_validation_issues=[],this.validators.forEach(function(a){var c=a(i,t);c&&i.own_validation_issues.push(c)}),!e)return this.own_validation_issues;var s=o([],this.own_validation_issues,!0);return this.answers.forEach(function(a){return s.push.apply(s,a.check_validation(i,t,!0))}),this.validation_issues=s,this.validation_issues},Object.defineProperty(n.prototype,"as_rows",{get:function(){var t=[];return this.answers.forEach(function(e){var i=e.to_row(!0);i instanceof Array?t.push.apply(t,i):t.push(i)}),t},enumerable:!1,configurable:!0}),n}();r.Item=h;var m=function(n,t){return t===void 0&&(t=u.ValidationIssueLevel.ERROR),function(e,i){var s=n(e,i);return typeof s=="string"?{item_id:e.id,level:t,issue:s,validator:n,last_checked_utc_time:new Date().toUTCString()}:null}};r.item_validator=m,r.ItemValidatorsWithProps={REQUIRED:function(n){return(0,r.item_validator)(function(t){for(var e=function(a){for(var c=0;c<a.extra_answers.length;c++)if(typeof a.extra_answers[c].raw_content<"u"||e(a.extra_answers[c]))return!0;return!1},i=0;i<t.answers.length;i++){var s=t.answers[i];if(typeof s.raw_content<"u"||n&&e(s))return null}return"At least one answer is required"})}},r.ItemValidators={REQUIRED:r.ItemValidatorsWithProps.REQUIRED(!1)};var p=function(n,t){return t===void 0&&(t=u.ValidationIssueLevel.ERROR),function(e,i,s){var a=n(e,i,s);return typeof a=="string"?{answer_id:e.id,level:t,issue:a,validator:n,last_checked_utc_time:new Date().toUTCString()}:null}};r.answer_validator=p,r.AnswerValidators={REQUIRED:(0,r.answer_validator)(function(n){return n.content_changed?typeof n.content>"u"?"Answer cannot be blank":null:"An answer is required"}),NOT_BLANK:(0,r.answer_validator)(function(n){return typeof n.content>"u"?"Answer cannot be blank":null})},r.AnswerValidatorsWithProps={OF_TYPE:function(n){return(0,r.answer_validator)(function(t){return typeof t.content!==n?"Answer must be a ".concat(n):null})},GT:function(n){return(0,r.answer_validator)(function(t){try{if(t.content>n)return null}catch(e){console.error({validation_error:"Validation error [GT]",x:n,error:e})}return"Answer must be greater than ".concat(n)})},GTE:function(n){return(0,r.answer_validator)(function(t){try{if(t.content>=n)return null}catch(e){console.error({validation_error:"Validation error [GTE]",x:n,error:e})}return"Answer must be ".concat(n," or larger")})},LT:function(n){return(0,r.answer_validator)(function(t){try{if(t.content<n)return null}catch(e){console.error({validation_error:"Validation error [LT]",x:n,error:e})}return"Answer must be less than ".concat(n)})},LTE:function(n){return(0,r.answer_validator)(function(t){try{if(t.content<=n)return null}catch(e){console.error({validation_error:"Validation error [LTE]",x:n,error:e})}return"Answer must be ".concat(n," or smaller")})}};var E=function(){function n(t,e){var i=this;this.content_history=[],this.validation_issues=[],this.own_validation_issues=[],this.to_row=function(a){if(a===void 0&&(a=!0),i.to_row_fun)return i.to_row_fun(i,a);var c={id:i.id,data_id:i.data_id||i.id,type:(0,r.get_type_name)(i.type),content:void 0,label:void 0,answer_utc_time:void 0},f=[c];if(a&&(i.extra_answers.forEach(function(v){return f.push.apply(f,v.to_row(a))}),i.options&&i.options.forEach(function(v){return v.extra_answers.forEach(function(O){return f.push.apply(f,O.to_row(a))})})),[u.AnswerType.UNKNOWN,u.AnswerType.NONE].findIndex(function(v){return v===i.type})!==-1)return a?f:c;if(i.last_answer_utc_time&&(c.answer_utc_time=i.last_answer_utc_time),[u.AnswerType.RADIO,u.AnswerType.SELECT].findIndex(function(v){return v===i.type})!==-1){var l=i.options[i.content];return c.label=l.label,c.content=l.content,a?f:c}if(i.type===u.AnswerType.CHECKBOX){c.content=JSON.stringify(i.content);var y=[];return i.options.forEach(function(v,O){i.content.findIndex(function(P){return P===O})!==-1&&y.push(v.label||v.content)}),c.label=JSON.stringify(y),a?f:c}return c.label=i.label,c.content=i.content,a?f:c};for(var s in t)s in["content"]||(this[s]=t[s]);if(typeof e!="string"||e==="")throw"An Answer must have an id";if(this.id=e,t.id&&(this.data_id=t.id),typeof t.type>"u")throw"An Answer must specify a type";this.type=t.type,t.extra_answers?this.extra_answers=(0,r.as_answers)(t.extra_answers,this.id):this.extra_answers=[],t.options&&(this.options=(0,r.as_options)(t.options,this.id)),this.default_content=t.default_content,t.validators?this.validators=t.validators:this.validators=[],t.to_row_fun&&(this.to_row_fun=t.to_row_fun)}return Object.defineProperty(n.prototype,"raw_content",{get:function(){if(this.content_changed)return this.content_history[this.content_history.length-1].content},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"content",{get:function(){return this.content_changed?this.content_history[this.content_history.length-1].content:this.default_content},set:function(t){this.content_history.push({utc_time:new Date().toUTCString(),content:t,source:u.ContentChangeSource.User})},enumerable:!1,configurable:!0}),n.prototype.reset_content=function(){this.content_history.push({utc_time:new Date().toUTCString(),content:this.default_content,source:u.ContentChangeSource.Reset}),this.extra_answers.forEach(function(t){return t.reset_content()}),this.options&&this.options.forEach(function(t){return t.extra_answers.forEach(function(e){return e.reset_content()})})},Object.defineProperty(n.prototype,"content_changed",{get:function(){return this.content_history.length>0},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"selected_option",{get:function(){if(this.type!==u.AnswerType.RADIO&&console.warn("selected_option is always undefined for Answers of type ".concat((0,r.get_type_name)(this.type))),typeof this.content<"u")return this.options[this.content]},enumerable:!1,configurable:!0}),n.prototype.check_validation=function(t,e,i){var s,a,c=this,f=[];return t.validation_issues=t.validation_issues.filter(function(l){return!("answer_id"in l)||l.answer_id!==c.id}),e.validation_issues=e.validation_issues.filter(function(l){return!("answer_id"in l)||l.answer_id!==c.id}),this.validators.forEach(function(l){var y=l(c,t,e);y!==null&&f.push(y)}),this.own_validation_issues=o([],f,!0),(s=t.validation_issues).push.apply(s,f),(a=e.validation_issues).push.apply(a,f),this.extra_answers.forEach(function(l){return f.push.apply(f,l.check_validation(t,e,i))}),this.options&&this.options.forEach(function(l){return l.extra_answers.forEach(function(y){return f.push.apply(f,y.check_validation(t,e,i))})}),this.validation_issues=f,i?this.validation_issues:this.own_validation_issues},Object.defineProperty(n.prototype,"last_answer_utc_time",{get:function(){if(this.content_history.length)return this.content_history[this.content_history.length-1].utc_time},enumerable:!1,configurable:!0}),n}();r.Answer=E;var b=function(){function n(t,e){for(var i in t)i in["content"]||(this[i]=t[i]);if(typeof e!="string"||e==="")throw"An Option must have an id";if(this.id=e,typeof t.content>"u")if(typeof t.label<"u")this.content=t.label;else throw"Cannot make unlabelled Option without specifying content.";else this.content=t.content;t.extra_answers?this.extra_answers=(0,r.as_answers)(t.extra_answers,this.id):this.extra_answers=[]}return n}();r.Option=b;var N=function(n,t){return n instanceof Array?n.map(function(e,i){return e instanceof E?e:new E(e,"".concat(t,"_a").concat(i))}):[n instanceof E?n:new E(n,"".concat(t,"_a0"))]};r.as_answers=N;var C=function(n,t){return n instanceof Array?n.map(function(e,i){return e instanceof b?e:new b(e,"".concat(t,"_o").concat(i))}):[n instanceof b?n:new b(n,"".concat(t,"_o0"))]};r.as_options=C;var R=function(n){return n instanceof Array?n.map(function(t){return t instanceof h?t:new h(t)}):[n instanceof h?n:new h(n)]};r.as_items=R;var T=function(n){switch(n){case u.AnswerType.NONE:return"none";case u.AnswerType.TEXT:return"text";case u.AnswerType.NUMBER:return"number";case u.AnswerType.RADIO:return"radio";case u.AnswerType.SELECT:return"select";case u.AnswerType.CHECKBOX:return"checkbox";case u.AnswerType.DATE:return"date";case u.AnswerType.TIME:return"time"}return"unknown"};r.get_type_name=T})(I);(function(r){var o=g&&g.__createBinding||(Object.create?function(w,_,d,h){h===void 0&&(h=d);var m=Object.getOwnPropertyDescriptor(_,d);(!m||("get"in m?!_.__esModule:m.writable||m.configurable))&&(m={enumerable:!0,get:function(){return _[d]}}),Object.defineProperty(w,h,m)}:function(w,_,d,h){h===void 0&&(h=d),w[h]=_[d]}),u=g&&g.__exportStar||function(w,_){for(var d in w)d!=="default"&&!Object.prototype.hasOwnProperty.call(_,d)&&o(_,w,d)};Object.defineProperty(r,"__esModule",{value:!0}),u(I,r),u(A,r)})(D);export{j as a,g as c,M as g,D as q};