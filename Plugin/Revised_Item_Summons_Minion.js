
/*--------------------------------------------------------------------------
  
 
　仲間を召喚するアイテム（杖）を作るスクリプト

■概要
　未出撃の仲間を召喚するアイテムが作れます

■使い方
　本スクリプトをpluginフォルダに入れて、
　種類：瞬間移動のアイテム（杖）を範囲：射程１で作成し、カスタムパラメータに{_summon:1}を入れると、
　そのアイテムは指定した対象を召喚する事が出来るアイテムになります。
　召喚出来る距離は、使用効果で指定範囲（数値）または全域を選んで決定します。

■注意事項
　召喚用アイテムはフィルタを自軍のみにしてください。
　（同盟や敵軍を有効にしてもかまいませんが、何も効果がありません）
　同盟、敵、暴走や自動AI状態の自軍ユニットは召喚用アイテムを使用しません（操作可能な自軍ユニットのみ使用可能です）


16/12/14  新規作成
19/02/14  テレポート杖（アイテム）を所持する自動AIユニットがテレポートを行おうとした際にエラーが起こるバグを暫定修正
19/02/14b 召喚の杖をAIが使用しないよう修正


■対応バージョン
　SRPG Studio Version:1.199


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。どんどん改造してください。
・クレジット明記無し　OK
・再配布、転載　OK
・SRPG Studio利用規約は遵守してください。
  
  
--------------------------------------------------------------------------*/

(function() {




//----------------------------------------
// TeleportationItemSelectionクラス
//----------------------------------------
// Defining state transitions
var ItemSummonSelectMode = {
	TARGET_SUMMON: 10	// Call a Fellow
};

var IntegerCheck = {
	Summoner: null
};


// Initialize
var alias10 = TeleportationItemSelection.setInitialSelection;
TeleportationItemSelection.setInitialSelection= function() {
	alias10.call(this);

	// For summoned items, display the summon screen
	if( typeof this._item.custom._summon === 'number' ) {
		var screenParam = ScreenBuilder.buildUnitSortie();
		this._unitSummonScreen = createObject(UnitSummonScreen);
		IntegerCheck.Summoner = this._item;
		SceneManager.addScreen(this._unitSummonScreen, screenParam);
	}

}


var alias11 = TeleportationItemSelection.moveItemSelectionCycle
TeleportationItemSelection.moveItemSelectionCycle= function() {
	var result = alias11.call(this);

	// Operation on the Summon screen
	var mode = this.getCycleMode();
	if (mode === ItemSummonSelectMode.TARGET_SUMMON) {
		result = this._moveSummonSelect();
	}

	return result;
}


var alias13 = TeleportationItemSelection._movePosSelect
TeleportationItemSelection._movePosSelect= function() {
	var result = this._posSelector.movePosSelector();

	// If you cancel from the position selection in the summons item, display the summons screen
	if (result === PosSelectorResult.CANCEL && typeof this._item.custom._summon === 'number' ) {
		var screenParam = ScreenBuilder.buildUnitSortie();
	
		this._unitSummonScreen = createObject(UnitSummonScreen);
		SceneManager.addScreen(this._unitSummonScreen, screenParam);

		// Clear position Selection range display
		this._posSelector.endPosSelector();

		this.changeCycleMode(ItemSummonSelectMode.TARGET_SUMMON);
		return MoveResult.CONTINUE;
	}
	
	return alias13.call(this);
}


// Working with the Summon screen
TeleportationItemSelection._moveSummonSelect= function() {
	if (SceneManager.isScreenClosed(this._unitSummonScreen)) {
		// When the decision is pressed on the summons screen, the selected unit is evacuated.
		if (this._unitSummonScreen.getResultCode() === UnitSortieResult.START) {

				//skip blocking
			InputControl.isStartAction= function() {
					return false;
			}
			InputControl.isStartActionForce= function() {
				if (!root.isSystemSettings(SystemSettingsType.SKIP)) {
					return false;
			}	
			return root.isInputAction(InputType.BTN8) || root.isMouseAction(MouseType.RIGHT);
			}
				//end skip blocking

			this._targetUnit = root.getObjectGenerator().generateUnitFromBaseUnit(this._unitSummonScreen.getSummonUnit());
			this._changePosSelect();


				

		}
		// Return to item selection if Cancel is pressed on the summon screen.
		else {
			return MoveResult.END;
		}
	}
	
	return MoveResult.CONTINUE;
}


var alias14 = TeleportationItemSelection._changeTargetSelect;
TeleportationItemSelection._changeTargetSelect= function() {
	// State transition to Target_summon if summons item
	if( typeof this._item.custom._summon === 'number' ) {
		this.changeCycleMode(ItemSummonSelectMode.TARGET_SUMMON);
		return;
	}

	alias14.call(this);
}





// Teleportation Item Use Class
//----------------------------------------
var alias101 = TeleportationItemUse.enterMainUseCycle;
TeleportationItemUse.enterMainUseCycle= function(itemUseParent) {

	var result = alias101.call(this, itemUseParent);
	// Get information about a target item
	var itemTargetInfo = itemUseParent.getItemTargetInfo();
	if( result == EnterResult.OK && typeof itemTargetInfo.item.custom._summon === 'number') {
		this._targetUnit.setAliveState(AliveType.ALIVE);
		// If it was a summons item, hide the object (it doesn't appear on the screen until the moment it appears)
		this._targetUnit.setInvisible(true);
		// If it was a summons item, put the target in a sortie state
		this._targetUnit.setSortieState(SortieType.SORTIE);
		// Focus at specified position
		this.changeCycleMode(ItemTeleportationUseMode.FOCUS);


			//skip restoring
			InputControl.isStartAction= function() {
					var type = EnvironmentControl.getSkipControlType();
		
			if (type === 0 || !root.isSystemSettings(SystemSettingsType.SKIP)) {
					return false;
			}
			if (root.isInputAction(InputType.BTN8)) {
				if (type === 1 && root.isMouseAction(MouseType.RIGHT)) {
					return false;
			}
				return true;
			}
				return false;
			}
			InputControl.isStartActionForce= function() {
				if (!root.isSystemSettings(SystemSettingsType.SKIP)) {
					return false;
			}	
			return root.isInputAction(InputType.BTN8) || root.isMouseAction(MouseType.RIGHT);
			}
			//end skip restoring
	}

	return result;
}




//----------------------------------------
// TeleportationItemInfoクラス
//----------------------------------------
TeleportationItemInfo.drawItemInfoCycle= function(x, y) {
	// Usually
	if( typeof this._item.custom._summon !== 'number' ) {
		ItemInfoRenderer.drawKeyword(x, y, this.getItemTypeName(StringTable.ItemInfo_Teleportation));
	}
	// Summon Items
	else {
		ItemInfoRenderer.drawKeyword(x, y, this.getItemTypeName('Summon'));
	}
	y += ItemInfoRenderer.getSpaceY();
	
	if( typeof this._item.custom._summon !== 'number' ) {
		this.drawRange(x, y, this._item.getRangeValue(), this._item.getRangeType());
		y += ItemInfoRenderer.getSpaceY();
	}
	
	this._drawValue(x, y);
}


var alias151 = TeleportationItemInfo.getInfoPartsCount;
TeleportationItemInfo.getInfoPartsCount= function() {
	// For subpoena items, the item information is only two lines.
	if( typeof this._item.custom._summon === 'number' ) {
		return 2;
	}
	return alias151.call(this);
}




//----------------------------------------
// TeleportationItemInfoクラス
//----------------------------------------
var alias201 = TeleportationItemAvailability._checkMulti;
TeleportationItemAvailability._checkMulti= function(unit, item) {
	// Always available for summoning items
	if( typeof item.custom._summon === 'number' ) {
		return true;
	}

	return alias201.call(this, unit, item);
}




//----------------------------------------
// UnitSummonScreenクラス
//----------------------------------------
var UnitSummonMode = {
	TOP: 0,
	HELP: 1,
	EMPTY: 3
};


// Companion Summon Screen
var UnitSummonScreen = defineObject(BaseScreen,
{
	_unitList: null,
	_indexPrev: 0,
	_leftWindow: null,
	_unitMenuTopWindow: null,
	_unitMenuBottomWindow: null,
	_resultCode: 0,
	_selectUnit: null,
	_cursor_set_unit: null,
	_infoWindow: null,
	
	setScreenData: function(screenParam) {
		this._prepareScreenMemberData(screenParam);
		this._completeScreenMemberData(screenParam);
	},
	
	moveScreenCycle: function() {
		var mode = this.getCycleMode();
		var result = MoveResult.CONTINUE;
		
		if (mode !== UnitSummonMode.EMPTY) {
			this._moveAnimation();
		}
		
		if (mode === UnitSummonMode.TOP) {
			result = this._moveTop();
		}
		else if (mode === UnitSummonMode.HELP) {
			result = this._moveHelp();
		}
		else if (mode === UnitSummonMode.EMPTY) {
			result = this._moveEmpty();
		}
		
		return result;
	},
	
	drawScreenCycle: function() {
		if (this.getCycleMode() !== UnitSummonMode.EMPTY) {
			var width = this._leftWindow.getWindowWidth() + this._unitMenuTopWindow.getWindowWidth();
			var height = this._leftWindow.getWindowHeight();
			var x = LayoutControl.getCenterX(-1, width);
			var y = LayoutControl.getCenterY(-1, height);
			
			width = this._leftWindow.getWindowWidth();
			height = this._unitMenuTopWindow.getWindowHeight();
			
			this._leftWindow.drawWindow(x, y);
			this._unitMenuTopWindow.drawWindow(x + width, y);
			this._unitMenuBottomWindow.drawWindow(x + width, y + height);
		}
		else {
			var x = LayoutControl.getCenterX(-1, this._infoWindow.getWindowWidth());
			var y = LayoutControl.getCenterY(-1, this._infoWindow.getWindowHeight());
			
			this._infoWindow.drawWindow(x, y);
		}
	},
	
	drawScreenBottomText: function(textui) {
		if (this.getCycleMode() !== UnitSummonMode.EMPTY) {
			if (this._unitMenuTopWindow.isTracingHelp()) {
				TextRenderer.drawScreenBottomText(this._unitMenuTopWindow.getHelpText(), textui);
			}
			else if (this._unitMenuBottomWindow.isHelpMode() || this._unitMenuBottomWindow.isTracingHelp()) {
				TextRenderer.drawScreenBottomText(this._unitMenuBottomWindow.getHelpText(), textui);
			}
			else {
				this._drawSummonUnitText(textui);
			}
		}
	},
	
	getSummonUnit: function() {
		return this._selectUnit;
	},
	
	getScreenTitleName: function() {
		return 'Summon List';
	},
	
	getScreenInteropData: function() {
		return root.queryScreen('UnitSortie');
	},
	
	getResultCode: function() {
		return this._resultCode;
	},
	
	_prepareScreenMemberData: function(screenParam) {
		this._unitList = this._createUnitList();
		this._indexPrev = -1;
		this._leftWindow = createWindowObject(UnitSummonListWindow, this);
		this._unitMenuTopWindow = createWindowObject(UnitMenuTopWindow, this);
		this._unitMenuBottomWindow = createWindowObject(UnitMenuBottomWindow, this);
		this._infoWindow = createWindowObject(InfoWindow, this);

		this._selectUnit = null;
		this._cursor_set_unit = null;
	},
	
	_completeScreenMemberData: function(screenParam) {
		if (this._unitList.length > 0) {
			this._leftWindow.setSortieList(this._unitList);
			this._unitMenuTopWindow.setUnitMenuData();
			this._unitMenuBottomWindow.setUnitMenuData();
			this._setMenuUnit(0);
		}
		else {
			this._infoWindow.setInfoMessage('There are no units that can be summoned.');
			this.changeCycleMode(UnitSummonMode.EMPTY);
		}
	},
	
	_setMenuUnit: function(index) {
		var unit = this._unitList[index];
		// Remember the currently selected unit
		this._cursor_set_unit = unit;
		
		this._unitMenuTopWindow.changeUnitMenuTarget(unit);
		this._unitMenuBottomWindow.changeUnitMenuTarget(unit);
	},
	
	_moveTop: function() {
		var recentlyInput;
		var input = this._leftWindow.moveWindow();
		var result = MoveResult.CONTINUE;
		
		if (input === ScrollbarInput.SELECT) {
			result = this._moveSelect();
		}
		else if (input === ScrollbarInput.CANCEL) {
			result = this._moveCancel();
		}
		else if (input === ScrollbarInput.NONE) {
			recentlyInput = this._leftWindow.getRecentlyInputType();
			this._moveNone();
		}
		
		return result;
	},
	
	_moveSelect: function() {
		this._resultCode = UnitSortieResult.START;

		index = this._leftWindow.getUnitListIndex();
		this._selectUnit = this._unitList[index];

		return MoveResult.END;
	},
	
	_moveCancel: function() {
		this._resultCode = UnitSortieResult.NONE;
		return MoveResult.END;
	},
	
	_moveNone: function() {
		var index = this._leftWindow.getUnitListIndex();
		
		if (index !== this._indexPrev) {
			this._setMenuUnit(index);
		}
		
		this._indexPrev = index;
		
		return MoveResult.CONTINUE;
	},
	
	_moveEmpty: function() {
		if (this._infoWindow.moveWindow() !== MoveResult.CONTINUE) {
			this._playCancelSound();
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	_moveAnimation: function() {
		this._unitMenuTopWindow.moveWindow();
		this._unitMenuBottomWindow.moveWindow();
		
		return MoveResult.CONTINUE;
	},
	
	_moveHelp: function() {
		if (!this._unitMenuBottomWindow.isHelpMode()) {
			this._leftWindow.enableSelectCursor(true);
			this.changeCycleMode(UnitSummonMode.TOP);
		}
		
		return MoveResult.CONTINUE;
	},
	
	_setHelpMode: function() {
		if (this._unitMenuBottomWindow.setHelpMode()) {
			this._leftWindow.enableSelectCursor(false);
			this.changeCycleMode(UnitSummonMode.HELP);
		}
	},
	
	_drawSummonUnitText: function(textui) {
		if( this._cursor_set_unit != null ) {
			TextRenderer.drawScreenBottomText(this._cursor_set_unit.getDescription(), textui);
		}
	},
	
	_playCancelSound: function() {
		MediaControl.soundDirect('commandcancel');
	},
	
	_createUnitList: function() {
		var unitlist = []
		for (var i = 0; i < root.getBaseData().getPlayerList().getCount(); i++){
			if (root.getBaseData().getPlayerList().getData(i).custom.Summonable <= IntegerCheck.Summoner.custom._summon && root.getBaseData().getPlayerList().getData(i).getAliveState() !== AliveType.DEATH && FusionControl.getFusionParent(root.getBaseData().getPlayerList().getData(i)) === null){
				root.getBaseData().getPlayerList().getData(i).setAliveState(AliveType.ALIVE)
				root.getBaseData().getPlayerList().getData(i).setSortieState(SortieType.UNSORTIE)
				root.getBaseData().getPlayerList().getData(i).setOrderMark(OrderMarkType.FREE)
				unitlist.push(root.getBaseData().getPlayerList().getData(i))
			}
			
		}
		return unitlist;
		// return PlayerList.getUnSortieList();
	}
}
);

//----------------------------------------
// UnitSummonListWindowクラス
//----------------------------------------
var UnitSummonListWindow = defineObject(UnitSortieListWindow,
{
	setSortieList: function(unitList) {
		var count = Math.floor(this.getWindowHeight() / DefineControl.getTextPartsHeight());
		
		this._unitList = unitList;
		
		this._scrollbar = createScrollbarObject(UnitSummonListScrollbar, this);
		this._scrollbar.setScrollFormation(1, count);
		this._scrollbar.setDataList2(unitList);
		this._scrollbar.setActive(true);
	}
}
);

//----------------------------------------
// UnitSummonListScrollbarクラス
//----------------------------------------
var UnitSummonListScrollbar = defineObject(UnitSortieListScrollbar,
{	
	drawScrollContent: function(x, y, object, isSelect, index) {
		var length = this._getTextLength();
		var textui = this.getParentTextUI();
		var font = textui.getFont();
		var color = textui.getColor();
		
		TextRenderer.drawKeywordText(x, y, object.getName(), length, color, font);
	},
	
	playSelectSound: function() {
		MediaControl.soundDirect('commandselect');
	},
	
	_isForceSortie: function(object) {
		return false;
	}
}
);

//----------------------------------------
// PlayerListクラス
//----------------------------------------
// Get a list of unsorties buddies
PlayerList.getUnSortieList= function() {
	//this.getMainList() || root.getBaseData().getPlayerList()
	//the second list does not allow units to appear when summoned. I do not know why. -LadyRena
	return AllUnitList.getUnSortieList(root.getBaseData().getPlayerList());
}


// Get a list of unsorties buddies (subordinate functions)
AllUnitList.getUnSortieList= function(list) {
	var funcCondition = function(unit) {
		return unit.getAliveState() !== AliveType.DEATH && FusionControl.getFusionParent(unit) === null
	};
	
	return this.getList(list, funcCondition);
}

BaseScrollbar.setDataList2 = function(list) {
	var i, count, data;
	
	this.resetScrollData();
	
	count = list.length;
	for (i = 0; i < count; i++) {
		data = list[i];
		this.objectSet(data);
	}
	
	this.objectSetEnd();
};



})();














