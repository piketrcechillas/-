ItemTitleFlowEntry.drawFlowEntry = function() {
	var x, y;
	var itemTargetInfo = this._itemUseParent.getItemTargetInfo();
	var textui = root.queryTextUI('itemuse_title');
	var color = textui.getColor();
	var font = textui.getFont();
	var pic = textui.getUIImage();
	var text;
	if (itemTargetInfo.item.isWeapon()){
		if (itemTargetInfo.item.custom.UseText != null){
			text = itemTargetInfo.item.custom.UseText;
		}
		else{
			text = itemTargetInfo.item.getName();
		}
	}
	else{
		text = itemTargetInfo.item.getName();
	}
	var width = (TitleRenderer.getTitlePartsCount(text, font) + 2) * TitleRenderer.getTitlePartsWidth();
	
	x = LayoutControl.getUnitCenterX(itemTargetInfo.unit, width, 0);
	y = LayoutControl.getUnitBaseY(itemTargetInfo.unit, TitleRenderer.getTitlePartsHeight()) - 20;
	
	TextRenderer.drawTitleText(x, y, text, color, font, TextFormat.CENTER, pic);
};

ItemWorkWindow.setItemWorkData = function(item) {
	var arr;
	
	if (item.isWeapon()) {
		arr = [StringTable.ItemWork_Equipment, StringTable.ItemWork_Use, StringTable.ItemWork_Discard];
		this._scrollbar.setObjectArray(arr);
	}
	else {
		arr = [StringTable.ItemWork_Use, StringTable.ItemWork_Discard];
		this._scrollbar.setObjectArray(arr);
	}
};


ItemSelectMenu.isCommandDisplayable = function() {
		if(item.isWeapon() && item.custom.PM === true) {
			 if (this.getCommandTarget().getMostResentMov() !== 0){
          		  return false;
        }
        else
            return true;}
        
        else
        	return true
	};

ItemSelectMenu.isWorkAllowed = function(index) {
	var result = false;
	var item = this._itemListWindow.getCurrentItem();
	
	if (item.isWeapon()) {
		if (index === 0) {
			result = ItemControl.isWeaponAvailable(this._unit, item);
		}
		else if (index === 1){
			
				result = this._isItemUsable(item);
		}
		else if (index === 2) {
			result = !item.isImportance();
		}
	}
	else {
		if (index === 0) {
			result = this._isItemUsable(item);
		}
		else if (index === 1) {
			result = !item.isImportance();
		}
	}
	
	return result;
};



ItemSelectMenu._doWorkAction = function(index) {
	var item = this._itemListWindow.getCurrentItem();
	var result = ItemSelectMenuResult.NONE;
	
	if (item.isWeapon()) {
		if (index === 0) {
			ItemControl.setEquippedWeapon(this._unit, item);
			this._resetItemList();
			this._processMode(ItemSelectMenuMode.ITEMSELECT);
		}
		else if (index === 1) {
			result = ItemSelectMenuResult.USE;
		}
		else if (index === 2) {
			this._processMode(ItemSelectMenuMode.DISCARD);
		}
	}
	else {
		if (index === 0) {
			result = ItemSelectMenuResult.USE;
		}
		else if (index === 1) {
			this._processMode(ItemSelectMenuMode.DISCARD);
		}
	}
	
	return result;
};

ItemPackageControl.getItemAvailabilityObject = function(item) {
	var obj;
	var type;
	if (item.isWeapon()){
		obj = this.getCustomItemAvailabilityObject(item, "OT_ItemEffectRange");//doggo
	}
	else{
		type = item.getItemType();
	}
	var arr = [
		UnusableItemAvailability, RecoveryItemAvailability, EntireRecoveryItemAvailability, DamageItemAvailability, DopingItemAvailability,
		ClassChangeItemAvailability, SkillChangeItemAvailability, KeyItemAvailability, QuickItemAvailability,
		TeleportationItemAvailability, RescueItemAvailability, ResurrectionItemAvailability, DurabilityChangeItemAvailability,
		StealItemAvailability, StateItemAvailability, StateRecoveryItemAvailability, SwitchItemAvailability,
		FusionItemAvailability, MetamorphozeItemAvailability
	];
	
	if (type === ItemType.CUSTOM) {
		obj = this.getCustomItemAvailabilityObject(item, item.getCustomKeyword());
	}
	else if (item.isWeapon()){
		obj = this.getCustomItemAvailabilityObject(item, "OT_ItemEffectRange");
	}
	else {
		obj = arr[type];
	}
	
	return createObject(obj);
};



ItemSelectMenu._isItemUsable = function(item) {
	var obj;
	// Wands cannot be used from the item list.
	if (item.isWand()) {
		return false;
	}
	if (item.custom.PM === true)
		if(item.isWeapon() && item.custom.Splash === true && item === ItemControl.getEquippedWeapon(this._unit) && this._unit.getMostResentMov() === 0)
			return true;


	if (item.custom.PM === false)
		if(item.isWeapon() && item.custom.Splash === true && item === ItemControl.getEquippedWeapon(this._unit)){
			return true;}


	
	if (!ItemControl.isItemUsable(this._unit, item)) {
		return false;
	}
	
	obj = ItemPackageControl.getItemAvailabilityObject(item);
	if (obj === null) {
		return false;
	}
	return obj.isItemAvailableCondition(this._unit, item);
};

ItemPackageControl.getItemSelectionObject = function(item) {
	var obj;
	if (item.isWeapon()){
		obj = this.getCustomItemSelectionObject(item,"OT_ItemEffectRange");
	}
	else{
		var type = item.getItemType();
	}
	var arr = [
		null, RecoveryItemSelection, EntireRecoveryItemSelection, DamageItemSelection, DopingItemSelection, 
		ClassChangeItemSelection, SkillChangeItemSelection, KeyItemSelection, QuickItemSelection,
		TeleportationItemSelection, RescueItemSelection, ResurrectionItemSelection, DurabilityChangeItemSelection,
		StealItemSelection, StateItemSelection, StateRecoveryItemSelection, SwitchItemSelection,
		FusionItemSelection, MetamorphozeItemSelection
	];
	
	if (type === ItemType.CUSTOM) {
		obj = this.getCustomItemSelectionObject(item, item.getCustomKeyword());
	}
	else if (item.isWeapon()){
		obj = this.getCustomItemSelectionObject(item,"OT_ItemEffectRange");
	}
	else if (type === ItemType.UNUSABLE) {
		return null;
	}
	else {
		obj = arr[type];
	}
	
	return createObject(obj);
};

ItemMainFlowEntry._completeMemberData = function(itemUseParent) {
	var animeData;
	var pos;
	if (itemUseParent.getItemTargetInfo().item.isWeapon()){
		animeData = null;
		pos = null;
	}
	else{
		animeData = itemUseParent.getItemTargetInfo().item.getItemAnime();
		pos = itemUseParent.getItemUseObject().getItemAnimePos(itemUseParent, animeData);
	}
	
	if (pos === null || itemUseParent.isItemSkipMode()) {
		return this._changeMainUse() ? EnterResult.OK : EnterResult.NOTENTER;
	}
	
	if (animeData !== null) {
		this._dynamicAnime.startDynamicAnime(animeData, pos.x, pos.y);
		this.changeCycleMode(ItemMainMode.ANIME);
		return EnterResult.OK;
	}
	
	return this._changeMainUse();
};

ItemMainFlowEntry._changeMainUse = function() {
	var result;
	if (this._itemUseParent.getItemTargetInfo().item.isWeapon()){
		result = this._itemUseParent.getItemUseObject().enterMainUseCycle(this._itemUseParent, this._itemUseParent.isItemSkipMode()) === EnterResult.OK;//megaman
	}
	else{
		result = this._itemUseParent.getItemUseObject().enterMainUseCycle(this._itemUseParent, this._itemUseParent.isItemSkipMode()) === EnterResult.OK;
	}
	if (result) {
		this.changeCycleMode(ItemMainMode.USE);
	}
	
	return result;
};

ItemMainFlowEntry._drawUse = function() {
	var result;
	if (this._itemUseParent.getItemTargetInfo().item.isWeapon()){
		return;
	}
	else{
		result = this._itemUseParent.getItemUseObject().drawMainUseCycle();
	}
	return result;
};

ItemMainFlowEntry._moveUse = function() {
	var result;
	if (this._itemUseParent.getItemTargetInfo().item.isWeapon()){
		return;
	}
	else{
		result =  this._itemUseParent.getItemUseObject().moveMainUseCycle();
	}
	return result;
};

ItemExpFlowEntry._getItemExperience = function(itemUseParent) {
	var itemTargetInfo = itemUseParent.getItemTargetInfo();
	var unit = itemTargetInfo.unit;
	var item = itemTargetInfo.item;
	var exp;
	if (item.isWeapon()){
		exp = 0;
	}
	else{
		exp = itemTargetInfo.item.getExp();
	}
	return ExperienceCalculator.getBestExperience(unit, exp);
};

ItemPackageControl.getItemUseParent = function(item) {
	var obj, parent;
	var type;
	
	if (!item.isWeapon()){
		type = item.getItemType();
	}
	else{
		obj = this.getCustomItemUseObject(item, 'OT_ItemEffectRange');
		parent = createObject(ItemUseParent);
		parent._itemUseObject = createObject(obj);
		
		return parent;
	}
	var arr = [
		null, RecoveryItemUse, EntireRecoveryItemUse, DamageItemUse, DopingItemUse,
		ClassChangeItemUse, SkillChangeItemUse, KeyItemUse, QuickItemUse,
		TeleportationItemUse, RescueItemUse, ResurrectionItemUse, DurabilityChangeItemUse,
		StealItemUse, StateItemUse, StateRecoveryItemUse, SwitchItemUse,
		FusionItemUse, MetamorphozeItemUse
	];

	if (type === ItemType.CUSTOM) {
		obj = this.getCustomItemUseObject(item, item.getCustomKeyword());
	}
	else if (type === ItemType.UNUSABLE) {
		return null;
	}
	else {
		obj = arr[type];
	}
	
	// Differs from getItemSelectionObject or getItemInfoObject, no return RecoveryItemUse etc.,
	// but return object which includes object.
	parent = createObject(ItemUseParent);
	parent._itemUseObject = createObject(obj);
	
	return parent;
};

ItemPackageControl.getItemInfoObject = function(item) {
	var obj;
	if (!item.isWeapon()){
		var type = item.getItemType();
	}
	var arr = [
		UnusableItemInfo, RecoveryItemInfo, EntireRecoveryItemInfo, DamageItemInfo, DopingItemInfo,
		ClassChangeItemInfo, SkillChangeItemInfo, KeyItemInfo, QuickItemInfo,
		TeleportationItemInfo, RescueItemInfo, ResurrectionItemInfo, DurabilityItemInfo,
		StealItemInfo, StateItemInfo, StateRecoveryItemInfo, SwitchItemInfo,
		FusionItemInfo, MetamorphozeItemInfo
	];
	
	if (type === ItemType.CUSTOM) {
		obj = this.getCustomItemInfoObject(item, item.getCustomKeyword());
	}
	else if (item.isWeapon()){
		obj = this.getCustomItemInfoObject(item, "OT_ItemEffectRange");
	}
	else {
		obj = arr[type];
	}
	
	return createObject(obj);
};