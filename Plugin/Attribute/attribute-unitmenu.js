//ユニットメニューに属性耐性一覧のページを追加

(function() {

var alias1 = UnitMenuScreen._configureBottomWindows;
UnitMenuScreen._configureBottomWindows = function(groupArray) {
	alias1.call(this, groupArray);
	groupArray.appendWindowObject(UnitMenuBottomAttributeWindow, this);
};

colorSetting = {
		red : 0xff0000,
		green : 0x3ada17
};
var UnitMenuBottomAttributeWindow = defineObject(BaseMenuBottomWindow,
{
	_unit: null,
	
	changeUnitMenuTarget: function(unit) {
		this._unit = unit;
	},
	
	drawWindowContent: function(x, y) {
		this._drawUnitResist(x, y);
	},
	
	_drawUnitResist: function(xBase, yBase) {
		var i, text;
		var unit = this._unit;
		var textui_name = this._getWindowTextUI_Name();
		var color_name = textui_name.getColor();
		var font_name = textui_name.getFont();
		var textui_param = this._getWindowTextUI_Param();
		var color_param = textui_param.getColor();
		var font_param = textui_param.getFont();
		var length = this._getUnitTextLength();
		var x = xBase + 15;
		var y = yBase + 7;
		var xspace = 0;
		var yspace = 0;
		var count = AttributeControl.getCount();
		var handle = root.createResourceHandle(false, AttributeControl.getAttackType(unit), 0, 0, 0);
		//1行に表示する数
		var col = 4;

		text = 'Affinity';
		TextRenderer.drawText(x + xspace, y + yspace, text, length, color_name, font_name);
		yspace += 30;

		GraphicsRenderer.drawImage(x + xspace, y + yspace, handle, GraphicsType.ICON);

		xspace += 30;
		yspace +=3;
		
		text = AttributeControl.getName(AttributeControl.getAttackType(unit));
		TextRenderer.drawText(x + xspace, y + yspace, text, length, color_name, font_name);

		yspace += 30;
		xspace -= 30;
		
		text = 'Affinity Effectiveness';
		TextRenderer.drawText(x + xspace, y + yspace, text, length, color_name, font_name);

		yspace += 20;
		xspace -= 50;
		for (i=0; i<count-1; i++){
			if(!AttributeControl.isShow(i)) {
				continue;
			}
			
		
			xspace += 50;

			text = AttributeControl.getName(i);
			TextRenderer.drawText(x + xspace, y + yspace, text, length, color_name, font_name);
			

			yspace +=20;
			
			if(AttributeControl.getUnitResist(unit, i)===100){};
			if(AttributeControl.getUnitResist(unit, i)>100){
				text = 'Weak';
				TextRenderer.drawText(x + xspace, y + yspace, text, length, colorSetting.red, font_param);}

			if(AttributeControl.getUnitResist(unit, i)<100){
				text = 'Strong';
				TextRenderer.drawText(x + xspace, y + yspace, text, length, colorSetting.green, font_param);}

			yspace -= 20;



			if( (i+1) % col === 0) {
				xspace = 0;
				yspace += 30;
			} else {
				xspace += 55;
				}
			}


		if(root.getCurrentSession().getCurrentMapInfo().custom.special === true) {
				yspace += 30;
		text = AttributeControl.getName(4);
		TextRenderer.drawText(x + xspace, y + yspace, text, length, color_name, font_name);
			}
		

		
	},
	
	_getWindowTextUI_Name: function() {
		return root.queryTextUI('infowindow_title');
	},

	_getWindowTextUI_Param: function() {
		return root.queryTextUI('default_window');
	},
	
	_getUnitTextLength: function() {
		return 180;
	}
}
);

})();