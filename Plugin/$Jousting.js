(function() {



var alias1 = AbilityCalculator.getPower;
AbilityCalculator.getPower = function(unit, weapon) {
		var pow;
		
		if (Miscellaneous.isPhysicsBattle(weapon)) {
			// Physical attack or Bow attack.
			pow = RealBonus.getStr(unit);
		}
		else {
			// Magic attack
			pow = RealBonus.getMag(unit);
		}
		
		// Atk formula. Weapon pow + (Pow or Mag)
		return pow + weapon.getPow();
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

var alias2 = DamageCalculator.calculateAttackPower;
DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
		if(item.isWeapon() && item.custom.Joust === true && item === ItemControl.getEquippedWeapon(this._unit)){
		var pow = (AbilityCalculator.getPower(active, weapon) + CompatibleCalculator.getPower(active, passive, weapon) + SupportCalculator.getPower(totalStatus))*this._unit.getMostResentMov();
		
		if (this.isEffective(active, passive, weapon, isCritical, trueHitValue)) {
			pow = Math.floor(pow * this.getEffectiveFactor());
		} }
		
		return pow;
	},

ItemSelectMenu._isItemUsable = function(item) {
	var obj;
	// Wands cannot be used from the item list.
	if (item.isWand()) {
		return false;
	}

	if(item.isWeapon() && item.custom.Joust === true && item === ItemControl.getEquippedWeapon(this._unit)){
			return true;}

}
})