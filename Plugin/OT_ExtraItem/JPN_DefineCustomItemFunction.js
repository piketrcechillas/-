
/*-----------------------------------------------------------------------------------------------
  
  �J�X�^���A�C�e���p�̊֐����C�u����
    
  �쐬��:
  o-to
  
  �X�V����:
  2015/10/11�F�͈͍U���A�C�e���̐V�K�쐬(����^)
  2015/10/13�F�͈͎w���t���X�e�[�^�X�ȂǗl�X�ȗv�f��ǉ�
  2015/10/16�F�����A�b�v�f�[�g1.035�ɑΉ�����悤�ɏC��
  2015/10/31�F�X�L���̏�Ԉُ햳���ɑΉ��A�GAI�����P
              �_���[�W���l�̕\���ǉ��A�_���[�W�G�t�F�N�g�⃆�j�b�g���ł𓯎��ɍĐ�����悤�C��
              �X�e�[�g�t�^���̃A�j�����X�e�[�g�̃}�b�v�A�j���Ɉˑ�����悤�C��
              �}�b�v�n�`�ύX���ʂ�ǉ�
              �g�p���̃_���[�W��G�̃_���[�W�ƈꏏ�ɍs���悤�ύX
  2015/12/04�F�ŐV�o�[�W�����ł̓G���[�ŏI�����Ă��܂����ߏC��
              �c�[�����̃A�j���[�V�����Đ��ɑΉ�
  2016/05/03:
  �⏕�I�����[(�Œ�_���[�Wor�Œ�񕜗ʂ�0)�̏ꍇ�̓_���[�W�\����HP�񕜗ʂ̕\�����ȗ������悤�ɏC��
  �GAI�̍s������Ɏg�p����X�R�A�ɔ{����ݒ�\��
  �g�p���_���[�W�Ƀ}�C�i�X�w����s����HP�񕜂���悤�ɏC��
  �^�����_���[�W��HP�z������ݒ�\��

  2016/10/17:
  �З͂̕␳�Ɋe�X�e�[�^�X�̒l���e������ݒ肪�ł���悤�ɏC��
  �ŏI�I�ȍU���͂ɕ␳�l���|����ݒ��ǉ�
  �ꕔ�뎚�C��
  
  2017/01/29:
  �X�e�[�g�t�^���̃G���[�Ή��ɂĖ��g�p������OT_setCustomItemAddState���O�̂��ߏC��

-----------------------------------------------------------------------------------------------*/

// �͈̓^�C�v
// List of range types.
OT_EffectRangeType = {
	  NORMAL:0
	, CROSS:1
	, XCROSS:2
	, DOUBLECROSS:3
	, LINE:4
	, HORIZONTALLINE:5
	, BREATH:6
};

// �X�e�[�^�X�̒�`�萔
// Definition of Statuses [pretty literal, tbh]
OT_DefineStatus = {
	  LV : 'LV'
	, HP : 'HP'
	, EP : 'EP'
	, FP : 'FP'
};

// ���ݒl�ƍő�l��������Ă���p�����[�^�̕R�Â��z��
// This is a list of Parameters whose current & max values remain separated.
OT_NowStatusMapping = {
	  MHP : 'HP'
	, MEP : 'EP'
	, MFP : 'FP'
};

OT_SLANTING = 100;

// ���ʔ͈͎����p�̔����ӏ��I���I�u�W�F�N�g
// Effect scope Implementation invocation place selection object [literal translation; idk]
var OT_EffectRangePosSelector = defineObject(PosSelector,
{
	item:null,
	
	setUnitOnly: function(unit, item, indexArray, type, filter) {
		//root.log("setUnitOnly activated.")
		this._unit = unit;
		this._indexArray = indexArray;
		this._filter = filter;
		this.item = item;
		MapLayer.getMapChipLight().setIndexArray(indexArray);
		this._setPosMenu(unit, item, type);
		this._posCursor = createObject(this._getObjectFromType(this._selectorType));
		this._posCursor.setParentSelector(this);
	},

	_getDefaultSelectorType: function() {
		//root.log("PosType FREE")
		return PosSelectorType.FREE;
	},
	
	movePosSelector: function() {
		var result = PosSelectorResult.NONE;
		
		if (InputControl.isSelectAction()) {
			this._playSelectSound();
			result = PosSelectorResult.SELECT;
		}
		else if (InputControl.isCancelAction()) {
			this._playCancelSound();
			result = PosSelectorResult.CANCEL;
		}
		else {
			this._posCursor.checkCursorEffectRange();
		}
		
		return result;
	},

	getSelectorTarget: function(isIndexArray) {
		var unit = this._mapCursor.getUnitFromCursor();
		
		return unit;
	},

	endPosSelector: function() {
		MapLayer.getMapChipLight().endLight();
		MapLayer.OT_getEffectRangePanel().endLight();
	}

}
);

// ���ʔ͈͎����p�͈̔͐����I�u�W�F�N�g
// Generates the effective range of the item for implementation [I think]
// WEAPON FUNCTION: This is a function I want to edit for the weapon side of things.
var OT_EffectRangeIndexArray = {
	createIndexArray: function(x, y, item) {
		//root.log("starting to create index array")
		var i, rangeValue, rangeType, arr;
		var startRange = 0;
		var endRange = 1;
		var count = 1;
		
		if (item.isWeapon()){
			//root.log("Item turned out to be weapon.")
			rangeValue=item.getEndRange();
			//rangeType=SelectionRangeType.MULTI;
			startRange = item.custom.OT_MinRange;
			endRange = item.getEndRange();
		}
		else{
			rangeValue = item.getRangeValue();
			rangeType = item.getRangeType();
			if (rangeType === SelectionRangeType.SELFONLY) {
				endRange = 0;
			}
			else if (rangeType === SelectionRangeType.MULTI) {
				endRange = rangeValue;
			}
			else if (rangeType === SelectionRangeType.ALL) {
				endRange = CurrentMap.getWidth() + CurrentMap.getHeight();
			}
			if( typeof item.custom.OT_MinRange === 'number' )
			{
				startRange = item.custom.OT_MinRange;
			}
		}
		if (item.isWeapon() && startRange > endRange){
			endRange = startRange;
		}
		else if( startRange > endRange && !item.isWeapon())
		{
			startRange = endRange;
		}

		var RangeType = OT_getCustomItemRangeType(item);
		//root.log("range type obtained")

		return this.getRangeIndexArray(x, y, startRange, endRange, RangeType, OT_getCustomItemRangeSpread(item));
	},
	
	getBestIndexArray: function(x, y, startRange, endRange) {
		var simulator = root.getCurrentSession().createMapSimulator();
		
		simulator.startSimulationRange(x, y, startRange, endRange);
		
		return simulator.getSimulationIndexArray();
	},

	getEffectRangeItemIndexArray: function(x, y, item, unit) {
		var startRange = OT_getCustomItemEffectRangeMin(item);
		var endRange = OT_getCustomItemEffectRangeMax(item);
		var effectRangeType = OT_getCustomItemEffectRangeType(item);
		var spread = OT_getCustomItemEffectSpread(item);

		return this.getEffectRangeIndexArray( x, y, startRange, endRange, effectRangeType, spread, unit.getMapX(), unit.getMapY() );
	},
	
	getEffectRangeItemIndexArrayPos: function(x, y, item, px, py) {
		var startRange = OT_getCustomItemEffectRangeMin(item);
		var endRange = OT_getCustomItemEffectRangeMax(item);
		var effectRangeType = OT_getCustomItemEffectRangeType(item);
		var spread = OT_getCustomItemEffectSpread(item);

		return this.getEffectRangeIndexArray( x, y, startRange, endRange, effectRangeType, spread, px, py );
	},

	getAIEffectRangeItemIndexArray: function(x, y, item) {
		var endRange = OT_getCustomItemEffectRangeMax(item);
		var startRange = OT_getCustomItemEffectRangeMin(item);
		var effectRangeType = OT_getCustomItemEffectRangeType(item);
		var spread = OT_getCustomItemEffectSpread(item);

		return this.getAIEffectRangeIndexArray( x, y, startRange, endRange, effectRangeType, spread );
	},

	getAIEffectRangeItemIndexArray2: function(x, y, item) {
		var endRange = OT_getCustomItemEffectRangeMax(item);
		var startRange = endRange;
		var effectRangeType = OT_getCustomItemEffectRangeType(item);
		var spread = OT_getCustomItemEffectSpread(item);

		if( startRange < 0 ) startRange = 0;

		return this.getAIEffectRangeIndexArray( x, y, startRange, endRange, effectRangeType, spread );
	},
		
	getRangeIndexArray: function(x, y, startRange, endRange, effectRangeType, spread) {
		var IndexArray = null;

		switch( effectRangeType )
		{
			case OT_EffectRangeType.CROSS:
				//root.log("cross range type.")
				IndexArray = OT_getCrossIndexArray(x, y, startRange, endRange, spread);
				break;
			
			case OT_EffectRangeType.XCROSS:
				//root.log("X-cross range type.")
				IndexArray = OT_getXCrossIndexArray(x, y, startRange, endRange, spread);
				break;

			case OT_EffectRangeType.DOUBLECROSS:
				//root.log("doublecross range type.")
				IndexArray = OT_getDoubleCrossIndexArray(x, y, startRange, endRange, spread);
				break;
			
			default:
				//root.log("default range type.")
				var simulator = root.getCurrentSession().createMapSimulator();
				simulator.startSimulationRange(x, y, startRange, endRange);
				IndexArray = simulator.getSimulationIndexArray();
				break;
		}
		return IndexArray;
	},
	
	getEffectRangeIndexArray: function(x, y, startRange, endRange, effectRangeType, spread, unit_x, unit_y) {
		var IndexArray = null;
		var direction = OT_getUnitDirection(unit_x, unit_y, x, y);

		switch( effectRangeType )
		{
			case OT_EffectRangeType.CROSS:
				IndexArray = OT_getCrossIndexArray(x, y, startRange, endRange, spread);
				break;
			
			case OT_EffectRangeType.XCROSS:
				////root.log("alphabet")
				IndexArray = OT_getXCrossIndexArray(x, y, startRange, endRange, spread);
				break;

			case OT_EffectRangeType.DOUBLECROSS:
				IndexArray = OT_getDoubleCrossIndexArray(x, y, startRange, endRange, spread);
				break;
			
			case OT_EffectRangeType.LINE:
				if( direction >= OT_SLANTING )
				{
					IndexArray = OT_getDiagonalIndexArray(x, y, startRange, endRange, direction - OT_SLANTING, spread);
				}
				else if( direction != -1)
				{
					IndexArray = OT_getLineIndexArray(x, y, startRange, endRange, direction, spread);
				}
				else
				{
					IndexArray = {};
				}
				break;

			case OT_EffectRangeType.HORIZONTALLINE:
				if( direction >= OT_SLANTING )
				{
					IndexArray = OT_getDiagonalHorizontalLineIndexArray(x, y, startRange, endRange, direction - OT_SLANTING, spread);
				}
				else if( direction != -1)
				{
					IndexArray = OT_getHorizontalLineIndexArray(x, y, startRange, endRange, direction, spread);
				}
				else
				{
					IndexArray = {};
				}
				break;

			case OT_EffectRangeType.BREATH:
				if( direction >= OT_SLANTING )
				{
					IndexArray = {};
				}
				else if( direction != -1)
				{
					IndexArray = OT_getBreathIndexArray(x, y, startRange, endRange, direction, spread);
				}
				else
				{
					IndexArray = {};
				}
				break;

			default:
				var simulator = root.getCurrentSession().createMapSimulator();
				simulator.startSimulationRange(x, y, startRange, endRange);
				IndexArray = simulator.getSimulationIndexArray();
				break;
		}
		return IndexArray;
	},

	getAIEffectRangeIndexArray: function(x, y, startRange, endRange, effectRangeType, spread) {
		var IndexArray = null;

		switch( effectRangeType )
		{
			case OT_EffectRangeType.CROSS:
			case OT_EffectRangeType.HORIZONTALLINE:
				IndexArray = OT_getCrossIndexArray(x, y, startRange, endRange, spread);
				break;
			
			case OT_EffectRangeType.XCROSS:
				IndexArray = OT_getXCrossIndexArray(x, y, startRange, endRange, spread);
				break;

			case OT_EffectRangeType.LINE:
			case OT_EffectRangeType.DOUBLECROSS:
				IndexArray = OT_getDoubleCrossIndexArray(x, y, startRange, endRange, spread);
				break;
			
			case OT_EffectRangeType.BREATH:
				IndexArray = OT_getAllBreathIndexArray(x, y, startRange, endRange, spread);
				break;

			default:
				var simulator = root.getCurrentSession().createMapSimulator();
				simulator.startSimulationRange(x, y, startRange, endRange);
				IndexArray = simulator.getSimulationIndexArray();
				
				break;
		}
		return IndexArray;
	},
		
	findUnit: function(indexArray, targetUnit) {
		//root.log("unit finder initiated.")
		var i, index, x, y;
		var count = indexArray.length;
		
		if (count === CurrentMap.getSize()) {
			return true;
		}
		
		for (i = 0; i < count; i++) {
			index = indexArray[i];
			x = CurrentMap.getX(index);
			y = CurrentMap.getY(index);
			if (PosChecker.getUnitFromPos(x, y) === targetUnit) {
				//root.log("targetUnit found!")
				return true;
			}
		}
		
		return false;
	},
	
	findPos: function(indexArray, xTarget, yTarget) {
		//root.log("posisition finder initiated.")
		var i, index, x, y;
		var count = indexArray.length;
		
		if (count === CurrentMap.getSize()) {
			return true;
		}
		
		for (i = 0; i < count; i++) {
			index = indexArray[i];
			x = CurrentMap.getX(index);
			y = CurrentMap.getY(index);
			if (x === xTarget && y === yTarget) {
				//root.log("position finder done, true.")
				return true;
			}
		}
		//root.log("position finder done, false.")
		return false;
	}
};

(function() {

var alias0 = PosFreeCursor.checkCursor;
PosFreeCursor.checkCursorEffectRange = function() {
	alias0.call(this);
	var item = this._parentSelector.item;
	////root.log("item called by alias0.")
	var unit = this._parentSelector._unit;
	////root.log("unit called by alias0.")
	if( this._parentSelector.getSelectorPos(true) ){
		var indexArray = OT_EffectRangeIndexArray.getEffectRangeItemIndexArray(this._xPrev, this._yPrev, item, unit);
		MapLayer.OT_getEffectRangePanel().setIndexArray(indexArray);
	}
	else
	{
		MapLayer.OT_getEffectRangePanel().endLight();
	}
};
//----------------------------------------------------------
// ���ʂŎg�p�ł��邻���Ȃ���
// Commonly-used functions [confident of this one]
//----------------------------------------------------------
// �g�p���̃_���[�W�Ŏ��S���邩�̐ݒ���擾
// This function determines if item HP loss can kill.
OT_getUseDamageDeath = function(item) {
	var value = true;
	if( typeof item.custom.OT_UseDamageDeath === 'boolean' )
	{
		value = item.custom.OT_UseDamageDeath;
	}

	return value;
};

// �z���_���[�W�̔{�����擾
// [Gets the amount of damage the user is healed for - vampirism, in other words. If this item is a damage type and deals 40 damage with the value being set to 0.25, the user heals 10HP.]
OT_getAbsorptionRate = function(item) {
	var value = 0.0;
	if( typeof item.custom.OT_AbsorptionRate === 'number' )
	{
		value = item.custom.OT_AbsorptionRate;
	}

	return value;
};

// �z���_���[�W�̔{�����Z�p�����l���擾
// [This just gets the actual HP value, using the above function.]
OT_getAbsorptionRateValue = function(item, value) {
	var point = Math.floor(value * OT_getAbsorptionRate(item));
	
	return point;
};

// AI�̃X�R�A���[�g���擾
// [Gets how heavily the AI scores the item]
// [Higher score = more likely to use]
OT_getAIScoreRate = function(item) {
	var value = 1.0;
	if( typeof item.custom.OT_AIScoreRate === 'number' )
	{
		value = item.custom.OT_AIScoreRate;
	}

	return value;
};

// AI�̃X�R�A���[�g���Z�p�����l���擾
// [Rounds the AI's score in case it was a decimal]
OT_getAIScoreRateValue = function(item, value) {
	var score = Math.floor(value * OT_getAIScoreRate(item))
	
	return score;
};

// �A�C�e���̃^�C�v���擾
// [Checks if it deals Physical (1), Magical (2), or Fixed (3+) damage.]
OT_getCustomItemType = function(item) {
	var damageType = item.custom.OT_DamageType;
	
	if (typeof damageType !== 'number' || damageType >= 3) {
		damageType = DamageType.FIXED;
	}
	return damageType;
};

// ���j�b�g�̍U���͂��擾
// [Gets the unit's attack power and adds it to the item.]
OT_getCustomItemValue = function(unit, item) {
	var reflection = item.custom.OT_UnitReflection;
	var plus = 0;

	if(reflection == true)
	{
		plus = OT_getCustomItemStatueReflection(unit, item);
	}
	
	return plus;
};

// �_���[�W�{�����擾
// [Multiplies the damage value.]
OT_getCustomItemDamageMagnification = function(item) {
	var val = item.custom.OT_DamageMagnification;
	
	if (typeof val !== 'number') {
		val = 1.0;
	}
	return val;
};

// �X�e�[�^�X�ɂ��U���̓{�[�i�X�����Z
// [Adds unit Strength or Magic to damage? Or something? Among some other feature for an edge case.]
OT_getCustomItemStatueReflection = function(unit, item) {
	var val = item.custom.OT_StatueReflection;
	var plus = 0;
	if(item.isWeapon()){
		plus = AbilityCalculator.getPower(unit,item);
	}
	if(val == null)
	{
		
		var damageType = OT_getCustomItemType(item);
		if (damageType === DamageType.PHYSICS) {
			plus = ParamBonus.getStr(unit);
		} else if (damageType === DamageType.MAGIC) {
			plus = ParamBonus.getMag(unit);
		}
	}
	else
	{
		
		for( var key in val )
		{
			if( typeof val[key] === 'number' )
			{
				var stateValue = OT_GetStatusValue(unit, key) * val[key];
				plus += stateValue;
			}
		}
	}
	
	return Math.floor(plus);
};

// �U���A�C�e���Ƀ��j�b�g�═��̍U���͂����Z
// "Increase attack power of units and weapons to attack items"
// [In other words, it adds your stats or weapon stats to the item's attack, I think.]
OT_getCustomItemPlus = function(unit, item) {
	var plus = 0;
	var weaponReflection = item.custom.OT_WeaponReflection;
	var weapon = ItemControl.getEquippedWeapon(unit);

	// ���j�b�g�X�e�[�^�X�ɂ��U���͉��Z
	// "Add attack power by unit status"
	// [Unsure.]
	plus = OT_getCustomItemValue(unit, item);

	// �A�C�e���̍U����
	// [Item's attack power is equal to itself plus weapon's attack power.]
	if(weaponReflection == true && weapon != null) {
		plus += weapon.getPow();
	}
	
	return plus;
};

// �U���A�C�e���̍ŏI�I�ȍU���͂��擾
// [Gets the end attack value. Rolls everything together.]
OT_getCustomItemFinalDamage = function(unit, item) {
	// �A�C�e���̍U����
	// [Checks item attack]
	var damage = OT_getCustomItemDamage(item);

	// ���j�b�g�Ƒ�������̍U����
	// [Pulls unit stats and equipped weapon stats as necessary.]
	damage += OT_getCustomItemPlus(unit, item);
	
	//�_���[�W�{�����v�Z�������̂�Ԃ�
	// [multiply and return it!]
	return Math.floor(damage * OT_getCustomItemDamageMagnification(item));
};

// �U���A�C�e���g�p���̃A�j���f�[�^���擾
// [Gets the animation.]
OT_getCustomItemAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemAnimeID(item);
	var runtime = OT_getCustomItemAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};


// �U���A�C�e���g�p���̃A�j����ID���擾
OT_getCustomItemAnimeID = function(item) {
	var AnimeData = item.custom.OT_EffectAnime;
	var AnimeID = null;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// �U���A�C�e���g�p���̃A�j���������^�C�����m�F
OT_getCustomItemAnimeRuntime = function(item) {
	var AnimeData = item.custom.OT_EffectAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// �g�p�_���[�W���̃A�j���f�[�^���擾
OT_getCustomItemUseDamageAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemUseDamageAnimeID(item);
	var runtime = OT_getCustomItemUseDamageAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};


// �g�p�_���[�W���̃A�j����ID���擾
OT_getCustomItemUseDamageAnimeID = function(item) {
	var AnimeData = item.custom.OT_UseDamageAnime;
	var AnimeID = null;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// �g�p�_���[�W���̃A�j���������^�C�����m�F
OT_getCustomItemUseDamageAnimeRuntime = function(item) {
	var AnimeData = item.custom.OT_UseDamageAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// �q�b�g���̃A�j���f�[�^���擾
OT_getCustomItemHitAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemHitAnimeID(item);
	var runtime = OT_getCustomItemHitAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};


// �q�b�g���̃A�j����ID���擾
OT_getCustomItemHitAnimeID = function(item) {
	var AnimeData = item.custom.IER_HitAnime;
	var AnimeID = null;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// �q�b�g���̃A�j���������^�C�����m�F
OT_getCustomItemHitAnimeRuntime = function(item) {
	var AnimeData = item.custom.IER_HitAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// �~�X���̃A�j���f�[�^���擾
OT_getCustomItemMissAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemMissAnimeID(item);
	var runtime = OT_getCustomItemMissAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};


// �~�X���̃A�j����ID���擾
OT_getCustomItemMissAnimeID = function(item) {
	var AnimeData = item.custom.IER_MissAnime;
	var AnimeID = null;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// �~�X���̃A�j���������^�C�����m�F
OT_getCustomItemMissAnimeRuntime = function(item) {
	var AnimeData = item.custom.IER_MissAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// GOOD�X�e�[�g�������̃A�j���f�[�^���擾
OT_getCustomItemDeleteGoodAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemDeleteGoodAnimeID(item);
	var runtime = OT_getCustomItemDeleteGoodAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};


// GOOD�X�e�[�g�������̃A�j����ID���擾
OT_getCustomItemDeleteGoodAnimeID = function(item) {
	var AnimeData = item.custom.IER_DelGoodAnime;
	var AnimeID = 200;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// GOOD�X�e�[�g�������̃A�j���������^�C�����m�F
OT_getCustomItemDeleteGoodAnimeRuntime = function(item) {
	var AnimeData = item.custom.IER_DelGoodAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// Bad�X�e�[�g�������̃A�j���f�[�^���擾
OT_getCustomItemDeleteBadAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemDeleteBadAnimeID(item);
	var runtime = OT_getCustomItemDeleteBadAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};

// BAD�X�e�[�g�������̃A�j����ID���擾
OT_getCustomItemDeleteBadAnimeID = function(item) {
	var AnimeData = item.custom.IER_DelBadAnime;
	var AnimeID = 101;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// BAD�X�e�[�g�������̃A�j���������^�C�����m�F
OT_getCustomItemDeleteBadAnimeRuntime = function(item) {
	var AnimeData = item.custom.IER_DelBadAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// �g�p�҂�GOOD�X�e�[�g�������̃A�j���f�[�^���擾
OT_getCustomItemUseDeleteGoodAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemUseDeleteGoodAnimeID(item);
	var runtime = OT_getCustomItemUseDeleteGoodAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};


// �g�p�҂�GOOD�X�e�[�g�������̃A�j����ID���擾
OT_getCustomItemUseDeleteGoodAnimeID = function(item) {
	var AnimeData = item.custom.OT_UseDelGoodAnime;
	var AnimeID = 200;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// �g�p�҂�GOOD�X�e�[�g�������̃A�j���������^�C�����m�F
OT_getCustomItemUseDeleteGoodAnimeRuntime = function(item) {
	var AnimeData = item.custom.OT_UseDelGoodAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// �g�p�҂�Bad�X�e�[�g�������̃A�j���f�[�^���擾
OT_getCustomItemUseDeleteBadAnimeData = function(item) {
	var anime = null;
	var animeID = OT_getCustomItemUseDeleteBadAnimeID(item);
	var runtime = OT_getCustomItemUseDeleteBadAnimeRuntime(item);
	
	if( animeID !== null )
	{
		var list = root.getBaseData().getEffectAnimationList(runtime);
		anime = list.getDataFromId(animeID);
	}
	
	return anime;
};

// �g�p�҂�BAD�X�e�[�g�������̃A�j����ID���擾
OT_getCustomItemUseDeleteBadAnimeID = function(item) {
	var AnimeData = item.custom.OT_UseDelBadAnime;
	var AnimeID = 101;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[0] === 'number')
		{
			AnimeID = AnimeData[0];
		}
	}
	
	return AnimeID;
};

// �g�p�҂�BAD�X�e�[�g�������̃A�j���������^�C�����m�F
OT_getCustomItemUseDeleteBadAnimeRuntime = function(item) {
	var AnimeData = item.custom.OT_UseDelBadAnime;
	var runtime = true;
	
	if(AnimeData != null)
	{
		if( typeof AnimeData[1] === 'boolean' )
		{
			runtime = AnimeData[1];
		}
	}
	
	return runtime;
};

// �J�n�˒����擾
OT_getCustomItemRangeMin = function(item) {
	var Range = 0;
	if (item.isWeapon()){
		//root.log("Weapon range snagged by custom range.")//doggo
		Range = item.getStartRange();
	}
	if( typeof item.custom.OT_MinRange === 'number' )
	{
		Range = item.custom.OT_MinRange;
	}

	return Range;
};

// �I���˒����擾
OT_getCustomItemRangeMax = function(item) {
	var endRange = 0;
	//root.log("loading endrange...")
	if(item.isWeapon()){
		rangeValue = item.getEndRange();
		rangeType = SelectionRangeType.MULTI;
	}
	else{
		rangeValue = item.getRangeValue();
		rangeType = item.getRangeType();
	}

	if (rangeType === SelectionRangeType.SELFONLY) {
		endRange = 0;
	}
	else if (rangeType === SelectionRangeType.MULTI) {
		endRange = rangeValue;
	}
	else if (rangeType === SelectionRangeType.ALL) {
		endRange = CurrentMap.getWidth() + CurrentMap.getHeight();
	}
	//root.log("endrange load finished.")
	return endRange;
};

// �񕜌n�����擾
OT_getCustomItemRecovery = function(item) {
	var value = false;
	if( typeof item.custom.OT_Recovery === 'boolean' )
	{
		value = item.custom.OT_Recovery;
	}

	return value;
};

// �g�p��̃_���[�W�ʂ��擾
OT_getCustomItemUseDamage = function(item, unit) {
	var value = 0;
	if( typeof item.custom.OT_UseDamage === 'number' )
	{
		value = item.custom.OT_UseDamage;
	}
	else if(unit != null)
	{
		// ������Ŏw�肳��Ă��ꍇ
		if( typeof item.custom.OT_UseDamage === 'string' )
		{
			var str = item.custom.OT_UseDamage;
			var regex = /^(\-?)([0-9]+)\%$/;
			var regexM = /^(\-?)M([0-9]+)\%$/;
			if (str.match(regex))
			{
				var hp = unit.getHp();
				var val = parseInt(RegExp.$2);
				value = Math.floor( hp * (val / 100) );
				
				if(RegExp.$1 == '-')
				{
					value *= -1;
				}
			}
			else if (str.match(regexM))
			{
				var hp = ParamBonus.getMhp(unit);
				var val = parseInt(RegExp.$2);
				value = Math.floor( hp * (val / 100) );
				
				if(RegExp.$1 == '-')
				{
					value *= -1;
				}
			}
		}
	}

	return value;
};

// �g�p��ɏ�����X�e�[�g���擾
OT_getCustomItemUseDelState = function(item) {
	var value = [];
	var list = root.getBaseData().getStateList();

	if( typeof item.custom.OT_UseDelState === 'object' )
	{
		val = item.custom.OT_UseDelState;
		var add, k;
		
		for( key in val )
		{
			k = key;
			break;
		}

		// ������Ŏw�肳��Ă��ꍇ
		if( k == 'BadState' )
		{
			for( var i=0 ; i<list.getCount() ; i++ )
			{
				add = list.getDataFromId(i);
				if( add.isBadState() )
				{
					value.push( new Array( add, val[key] ) );
				}
			}
		}
		else if( k == 'GoodState' )
		{
			for( var i=0 ; i<list.getCount() ; i++ )
			{
				add = list.getDataFromId(i);
				if( add.isBadState() == false )
				{
					value.push( new Array( add, val[key] ) );
				}
			}
		}
		else if( k == 'AllState' )
		{
			for( var i=0 ; i<list.getCount() ; i++ )
			{
				add = list.getDataFromId(i);
				value.push( new Array( add, val[key] ) );
			}
		}
		else
		{
			try {
				for( key in val )
				{
					add = list.getDataFromId(key);
					if( add != null ) value.push( new Array( add, val[key] ) );
				}
			} catch(e) {
				root.msg('[�͈͍U��]�����X�e�[�g�̎w�肪�s���ł��B\n�A�C�e��ID:' + item.getId());
				root.endGame();
			}
		}
	}

	return value;
};

// �g�p��ɕt�^�����X�e�[�g���擾
OT_getCustomItemUseAddState = function(item) {
	var value = [];
	var list = root.getBaseData().getStateList();

	if( typeof item.custom.OT_UseAddState === 'object' )
	{
		val = item.custom.OT_UseAddState;
		var add, k;
		
		for( key in val )
		{
			add = list.getDataFromId(key);
			if( add != null )
			{
				value.push( new Array( add, val[key] ) );
				
				
			}
		}
	}

	return value;
};

// ���j�b�g�ɃX�e�[�g��t�^����(���ݖ��g�p)
OT_setCustomItemAddState = function(unit, targetUnit, addState) {
	var value = null;

	// �X�e�[�g�̒ǉ�
	for( var j=0 ; j<addState.length ; j++)
	{
		if( Probability.getProbability( addState[j][1] ) && StateControl.getTurnState( targetUnit, addState[j][0] ) === null )
		{
			// �ϐ��X�e�[�g���m�F
			if (StateControl.isStateBlocked(targetUnit, unit, addState[j][0])) {
				// �X�e�[�g�͖����Ώۂł��邽�ߔ������Ȃ�
				continue;
			}
				
			StateControl.arrangeState(targetUnit, addState[j][0], IncreaseType.INCREASE);
			if( addState[j][0].isBadState() )
			{
				value = value | 0x02;
			}
			else
			{
				value = value | 0x01;
			}
		}
	}
	
	
	return value;
};

// ���j�b�g�̃X�e�[�g����������
OT_setCustomItemDelState = function(unit, delState) {
	var value = null;

	// �X�e�[�g�̉���
	for( var j=0 ; j<delState.length ; j++)
	{
		if( Probability.getProbability( delState[j][1] ) && StateControl.getTurnState( unit, delState[j][0] ) !== null )
		{
			StateControl.arrangeState(unit, delState[j][0], IncreaseType.DECREASE);
			if( delState[j][0].isBadState() )
			{
				value = value | 0x01;
			}
			else
			{
				value = value | 0x02;
			}
		}
	}
	
	
	return value;
};

// �O�b�h�X�e�[�^�X���܂܂�Ă邩
OT_getCustomItemisGoodState = function(array) {
	for( var i=0 ; i<array.length ; i++)
	{
		if( !array[i][0].isBadState() )
		{
			return true;
		}
	}
	
	return false;
};

// �o�b�h�X�e�[�^�X���܂܂�Ă邩
OT_getCustomItemisBadState = function(array) {
	for( var i=0 ; i<array.length ; i++)
	{
		if( array[i][0].isBadState() )
		{
			return true;
		}
	}
	
	return false;
};

// �A�j���̍Đ����̑��J�E���g�����擾
OT_getCustomItemAnimeFrameCounter = function(anime) {
	
	var id = anime.getMotionIdFromIndex(0);
	var frame = anime.getFrameCount(id);
	var count = 0;

	for( var i=0 ; i<frame ; i++)
	{
		count += anime.getFrameCounterValue(id, i);
	}

	
	
	return count;
};

// �X�e�[�^�X�擾
OT_GetStatusValue = function(unit, type) {
	var value = 0;
	
	// �p�����[�^���錾����Ă��鎖���m�F����
	if(!OT_isDefineParam(type))
	{
		return 0;
	}
	
	switch(type)
	{
		case OT_DefineStatus.LV:
			value = unit.getLv();
			break;

		case OT_DefineStatus.HP:
			value = unit.getHp();
			break;

		case OT_DefineStatus.EP:
			value = OT_GetNowEP(unit);
			break;

		case OT_DefineStatus.FP:
			value = OT_GetNowFP(unit);
			break;

		default:
			value = ParamBonus.getBonus(unit, ParamType[type]);
			break;
	}
	
	return value;
};

OT_isDefineParam = function(type) {
	// ���x���̓X�N���v�g�̒萔�Œ�`����Ă���
	switch(type)
	{
		case OT_DefineStatus.LV:
			//root.log("level defined.")
			return true;
	}

	// ���ݒl�ƍő�l��������Ă���p�����[�^
	for( var key in OT_NowStatusMapping )
	{
		if( type == OT_NowStatusMapping[key] )
		{
			if(typeof UnitParameter[key] == 'undefined')
			{
				
				return false;
			}
			return true;
		}
	}

	// �p�����[�^���錾����Ă��Ȃ�
	if(typeof UnitParameter[type] == 'undefined')
	{
		
		return false;
	}
	
	return true;
};

OT_getParamName = function( type ) {
	// �p�����[�^�̒�`�m�F
	if( !OT_isDefineParam(type) )
	{
		return '';
	}

	// ���x���̓X�N���v�g�̒萔�Œ�`����Ă��邽�ߒ萔��Ԃ�
	switch(type)
	{
		case OT_DefineStatus.LV:
			return StringTable.Status_Level;
	}

	// ���ݒl�ƍő�l��������Ă���p�����[�^
	for( var key in OT_NowStatusMapping )
	{
		if( type == key )
		{
			return 'Max' + UnitParameter[key].getParameterName();
		}
		
		if( type == OT_NowStatusMapping[key] )
		{
			return UnitParameter[key].getParameterName();
		}
	}
	
	return UnitParameter[type].getParameterName();
};

//----------------------------------------------------------
// �͈͍U���p
//----------------------------------------------------------
// ��_���[�W�n�ł��邩���擾
OT_getNoDamegeAttack = function(item) {
	var type = OT_getCustomItemType(item);
	var value = OT_getCustomItemDamage(item);
	
	if( type == DamageType.FIXED && value == 0 && item.custom.OT_WeaponReflection != true )
	{
		return true;
	}
	return false;
};

// �A�C�e���̍U���͂��擾
OT_getCustomItemDamage = function(item) {
	var damage = 0;
	////root.log("begin damage loading.")
	if ( typeof item.custom.IER_Value === 'number' )
	{
		damage = item.custom.IER_Value;
	}
	////root.log("end damage loading.")
	return damage;
};

// �͈͓��̃L�����ɖ����ʂɍU�����邩�擾
OT_getCustomItemIndifference = function(item) {
	var indifference = false;
	
	if( item.custom.IER_Indifference != null )
	{
		indifference = item.custom.IER_Indifference;
	}
	
	return indifference;
};

// ���ʔ͈͂��擾
OT_getCustomItemEffectRange = function(item) {
	var startRange = 0;
	var endRange = 1;
	var Range = {};
	////root.log("Fuckery?")
	var str = item.custom.IER_EffectRange;
	if( typeof str === 'string' )
	{
		
		var regex = /^([0-9]+)\-([0-9]+)$/;
		if (str.match(regex))
		{
			startRange = parseInt(RegExp.$1);
			endRange = parseInt(RegExp.$2);
			
			Range[0] = startRange;
			Range[1] = endRange;
			////root.log("Fuckery.")
			return Range;
		}
	}
	
	return null;
};

// ���ʔ͈͍ŏ��l���擾
OT_getCustomItemEffectRangeMin = function(item) {
	var Range = 0;
	var RangeData = OT_getCustomItemEffectRange(item);
	
	if( RangeData != null ){
		Range = RangeData[0];
	}
	////root.log("Custom Effect Range loaded.")
	return Range;
};

// ���ʔ͈͍ő�l���擾
OT_getCustomItemEffectRangeMax = function(item) {
	var Range = 0;
	var RangeData = OT_getCustomItemEffectRange(item);
	
	if( RangeData != null ){
		Range = RangeData[1];
	}
	////root.log("Custom Range loaded")
	return Range;
};

// ����ɓ��Ă����̎擾�o���l�̔{���擾
OT_getCustomItemEXPMagnification = function(item) {
	var Magnification = 1;

	if ( typeof item.custom.IER_EXPMagnification === 'number' )
	{
		Magnification = item.custom.IER_EXPMagnification;
	}

	return Magnification;
};

// �˒��^�C�v�̎擾
OT_getCustomItemRangeType = function(item) {
	var value = 0;

	if ( typeof item.custom.IER_RangeType === 'number' ){
		////root.log("IER_RangeType obtained.")
		value = item.custom.IER_RangeType;
	}

	return value;
};

// �͈̓^�C�v�̎擾
OT_getCustomItemEffectRangeType = function(item) {
	var value = 0;

	if ( typeof item.custom.IER_EffectRangeType === 'number' ){
		value = item.custom.IER_EffectRangeType;
		////root.log("IER_EffectRangeType obtained.")
	}

	return value;
};


// �˒��̍L������̒����l�̎擾
OT_getCustomItemRangeSpread = function(item) {
	var value = 1;

	if ( typeof item.custom.IER_RangeSpread === 'number' ){
		value = item.custom.IER_RangeSpread;
		//root.log("IER_RangeSpread obtained.")
	}

	if( value < 1 ) value = 1;

	return value;
};

// �͈͂̍L������̒����l�̎擾
OT_getCustomItemEffectSpread = function(item) {
	var value = 1;

	if ( typeof item.custom.IER_EffectSpread === 'number' ){
		value = item.custom.IER_EffectSpread;
		////root.log("EffectSpread obtained.")
	}

	if( value < 1 ) value = 1;

	return value;
};

// ���������Ώۂ̏�����X�e�[�g���擾
OT_getCustomItemDelState = function(item) {
	var value = [];
	var list = root.getBaseData().getStateList();

	if( typeof item.custom.IER_DelState === 'object' )
	{
		val = item.custom.IER_DelState;
		var add, k;
		
		for( key in val )
		{
			k = key;
			break;
		}

		// ������Ŏw�肳��Ă��ꍇ
		if( k == 'BadState' )
		{
			for( var i=0 ; i<list.getCount() ; i++ )
			{
				add = list.getDataFromId(i);
				if( add.isBadState() )
				{
					value.push( new Array( add, val[key] ) );
				}
			}
		}
		else if( k == 'GoodState' )
		{
			for( var i=0 ; i<list.getCount() ; i++ )
			{
				add = list.getDataFromId(i);
				if( add.isBadState() == false )
				{
					value.push( new Array( add, val[key] ) );
				}
			}
		}
		else if( k == 'AllState' )
		{
			for( var i=0 ; i<list.getCount() ; i++ )
			{
				add = list.getDataFromId(i);
				value.push( new Array( add, val[key] ) );
			}
		}
		else
		{
			try {
				for( key in val )
				{
					add = list.getDataFromId(key);
					if( add != null ) value.push( new Array( add, val[key] ) );
				}
			} catch(e) {
				root.msg('[�͈͍U��]�����X�e�[�g�̎w�肪�s���ł��B\n�A�C�e��ID:' + item.getId());
				root.endGame();
			}
		}
	}

	return value;
};

// ���������Ώۂɕt�^�����X�e�[�g���擾
OT_getCustomItemAddState = function(item) {
	var value = [];
	var list = root.getBaseData().getStateList();

	if( typeof item.custom.IER_AddState === 'object' )
	{
		val = item.custom.IER_AddState;
		var add, k;
		
		for( key in val )
		{
			add = list.getDataFromId(key);
			if( add != null )
			{
				value.push( new Array( add, val[key] ) );
				
				
			}
		}
	}

	return value;
};

// ���j�b�g�̌����擾
OT_getUnitDirection = function(x, y, px, py) {
	var value = 0;
	
	// ���Έʒu���擾
	var pointX = px - x;
	var pointY = py - y;
	
	// ���΍��W��0,0�Ȃ�-1��Ԃ�
	if( pointX == 0 && pointY == 0 ) return -1;

	// ���x�΂߂Ȃ��Βl���������Ȃ�
	if( Math.abs(pointX) == Math.abs(pointY) )
	{
		if( pointX < 0 )
		{
			if( pointY < 0 )
			{
				return OT_SLANTING + 0;
			}
			else if( pointY > 0 )
			{
				return OT_SLANTING + 3;
			}
		}
		else if( pointX > 0 )
		{
			if( pointY < 0 )
			{
				return OT_SLANTING + 1;
			}
			else if( pointY > 0 )
			{
				return OT_SLANTING + 2;
			}
		}
	}
	else if(Math.abs(pointX) > Math.abs(pointY))
	{
		if( pointX < 0 )
		{
			return DirectionType.LEFT;
		}
		else
		{
			return DirectionType.RIGHT;
		}
	}
	else if(Math.abs(pointX) < Math.abs(pointY))
	{
		if( pointY < 0 )
		{
			return DirectionType.TOP;
		}
		else
		{
			return DirectionType.BOTTOM;
		}
	}
	
	return -1;
};

// �����������j�b�g�̉�𗦂ŕϓ����邩
OT_getCustomItemHitAvoid = function(item) {
	var value = false;
	if( typeof item.custom.IER_HitAvoid === 'boolean' ){
		value = item.custom.IER_HitAvoid;
		//root.log("IER_HitAvoid checked.")
	}

	return value;
};

// ���������擾
OT_getCustomItemHitValue = function(item) {
	var value = 100;
	if( typeof item.custom.IER_HitValue === 'number' ){
		value = item.custom.IER_HitValue;
		//root.log("Custom Hit loaded.")
	}
	return value;
};

// �����������j�b�g�ˑ������ׂ�
OT_getCustomItemHITReflectionUnit = function(item) {
	var Data = item.custom.IER_HitReflection;
	var value = false;
	
	if(Data != null)
	{
		if( typeof Data[0] === 'boolean' ){
			value = Data[0];
			//root.log("Unit stats loaded.")
		}
	}
	return value;
};

// ������������ˑ������ׂ�
OT_getCustomItemHITReflectionWeapon = function(item) {
	var Data = item.custom.IER_HitReflection;
	var value = false;
	
	if(Data != null)
	{
		if( typeof Data[1] === 'boolean' ){
			value = Data[1];
			//root.log("Weapon stats loaded.")
		}
	}
	return value;
};


// ���ۂ̖��������擾
OT_getCustomItemHitPercent = function(unit, targetUnit, item) {
	var hit, avoid, percent;
	var unitTotalStatus = SupportCalculator.createTotalStatus(unit);
	var targetUnitTotalStatus = SupportCalculator.createTotalStatus(targetUnit);
	var weapon = ItemControl.getEquippedWeapon(unit);
	
	hit = OT_getCustomItemHitValue(item);
	avoid = 0;
	
	if( OT_getCustomItemHITReflectionUnit(item) )
	{
		hit += AbilityCalculator.getHit(unit,weapon) + SupportCalculator.getHit(unitTotalStatus);
	}

	if( OT_getCustomItemHitAvoid(item) )
	{
		avoid = AbilityCalculator.getAvoid(targetUnit) + SupportCalculator.getAvoid(targetUnitTotalStatus);
	}

	percent = hit - avoid;
	
	
	return HitCalculator.validValue(unit, targetUnit, weapon, percent);
};

// �������邩�𔻒�
OT_getCustomItemHitCheck = function(unit, targetUnit, item) {
	return Probability.getProbability( OT_getCustomItemHitPercent(unit, targetUnit, item) );
};

// ���ʔ͈͓��̃}�b�v�`�b�v��ύX����
OT_isCustomItemMapChipChange = function(chip, terrain) {
	var value = false;
	var data = terrain.custom.IER_MapChipChangeGroup;
	
	if( chip[0] == 'ALL' ) return true;
	
	if( typeof data === 'object' )
	{
		for( var i=0 ; i<data.length ; i++ )
		{
			if( chip[0] == data[i] )
			{
				return true;
			}
		}
	}

	return false;
};

// ���ʔ͈͓��̕ύX��̃}�b�v�`�b�v�̃f�[�^
OT_getCustomItemMapChipChangeDate = function(item) {
	var value = null;
	var data = item.custom.IER_MapChipChangeAfter;
	if( typeof data === 'object' )
	{
		value = data;
	}

	return value;
};

// ������W�������˒��͈͓��ɓ����Ă��邩
OT_getPointinGuessRange = function(x, y, px, py, startRange, endRange) {
	
	var ax = Math.abs( x - px );
	var ay = Math.abs( y - py );
	
	if( startRange <= ax && ax <= endRange )
	{
		if( startRange <= ay && ay <= endRange )
		{
			return true;
		}
	}


	return false;
};

// �͈͍U���p�̍��W��ݒ�
OT_getMapAnimationIERPos = function(x, y) {
	x -= 80;
	y -= 160;
	
	return createPos(x, y);
};


//----------------------------------------------------------
// ���ʔ͈͗p�p�l��
//----------------------------------------------------------
MapLayer.OT_EffectRangePanel = null;

MapLayer.OT_getEffectRangePanel = function() {
	return this.OT_EffectRangePanel;
};

var alias2 = MapLayer.prepareMapLayer;
MapLayer.prepareMapLayer = function() {
	alias2.call(this);
	this.OT_EffectRangePanel = createObject(MapChipLight);
	this.OT_EffectRangePanel.setLightType(MapLightType.RANGE);
};

var alias3 = MapLayer.moveMapLayer;
MapLayer.moveMapLayer = function() {
	this.OT_EffectRangePanel.moveLight();
	return alias3.call(this);
};

var alias4 = MapLayer.drawUnitLayer;
MapLayer.drawUnitLayer =  function() {
	alias4.call(this);
	this.OT_EffectRangePanel.drawLight();
};


//----------------------------------------------------------
// ���ʔ͈͗p�̃C���f�b�N�X�쐬
//----------------------------------------------------------
//�\����
OT_getCrossIndexArray = function(x, y, startRange, endRange, spread) {
	var array = [];

	for( var i=0 ; i<=4 ; i++ )
	{
		Array.prototype.push.apply( array, OT_getLineIndexArray(x, y, startRange, endRange, i, spread) );
	}
	
	return unique(array);
};

//�꒼��
OT_getLineIndexArray = function(x, y, startRange, endRange, direction, spread) {
	var array = [];
	var index = -1;
	
	for( var j=0 ; j<spread ; j++ )
	{
		for( var i=startRange ; i<=endRange ; i++ )
		{
			switch(direction) {
				case DirectionType.LEFT:
					index = CurrentMap.getIndex(x-i, y-j);
					break;
	
				case DirectionType.TOP:
					index = CurrentMap.getIndex(x-j, y-i);
					break;
	
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x+i, y-j);
					break;
	
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x-j, y+i);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}

			switch(direction) {
				case DirectionType.LEFT:
					index = CurrentMap.getIndex(x-i, y+j);
					break;
	
				case DirectionType.TOP:
					index = CurrentMap.getIndex(x+j, y-i);
					break;
	
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x+i, y+j);
					break;
	
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x+j, y+i);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
		}
	}
	
	return unique(array);
};

//�~�^
OT_getXCrossIndexArray = function(x, y, startRange, endRange, spread) {
	var array = [];

	for( var i=0 ; i<=4 ; i++ )
	{
		Array.prototype.push.apply( array, OT_getDiagonalIndexArray(x, y, startRange, endRange, i, spread) );
	}
	
	return unique(array);
};

//�΂ߐ�
OT_getDiagonalIndexArray = function(x, y, startRange, endRange, direction, spread) {
	var array = [];
	var index = -1;
	
	for( var j=0 ; j<spread ; j++ )
	{
		var point1 = Math.floor( (1+j) / 2 );
		var point2 = Math.floor( (j) / 2 );
		for( var i=startRange ; i<=endRange ; i++ )
		{
			switch(direction) {
				//����
				case DirectionType.LEFT:
					index = CurrentMap.getIndex(x-i-point2, y-i+point1);
					break;
	
				//�E��
				case DirectionType.TOP:
					index = CurrentMap.getIndex(x+i-point1, y-i-point2);
					break;
	
				//�E��
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x+i+point2, y+i-point1);
					break;
	
				//����
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x-i+point1, y+i+point2);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}

			switch(direction) {
				//����
				case DirectionType.LEFT:
					index = CurrentMap.getIndex(x-i+point1, y-i-point2);
					break;
	
				//�E��
				case DirectionType.TOP:
					index = CurrentMap.getIndex(x+i+point2, y-i+point1);
					break;
	
				//�E��
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x+i-point1, y+i+point2);
					break;
	
				//����
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x-i-point2, y+i-point1);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
		}
	}
	
	return unique(array);
};

//�{�~�^
OT_getDoubleCrossIndexArray = function(x, y, startRange, endRange, spread) {
	var array = [];

	for( var i=0 ; i<=4 ; i++ )
	{
		Array.prototype.push.apply( array, OT_getLineIndexArray(x, y, startRange, endRange, i, spread) );
		Array.prototype.push.apply( array, OT_getDiagonalIndexArray(x, y, startRange, endRange, i, spread) );
	}
	
	return unique(array);
};

//�u���X�^
OT_getBreathIndexArray = function(x, y, startRange, endRange, direction, spread) {
	var array = [];
	var index = -1;
	
	for( var i=startRange ; i<=endRange ; i++ )
	{
		var point = Math.floor( (i + spread - 1) / spread );

		switch(direction) {
			case DirectionType.LEFT:
				Array.prototype.push.apply( array, OT_getHorizontalLineIndexArray(x-i, y, 0, point, direction, 1) );
				break;

			case DirectionType.TOP:
				Array.prototype.push.apply( array, OT_getHorizontalLineIndexArray(x, y-i, 0, point, direction, 1) );
				break;

			case DirectionType.RIGHT:
				Array.prototype.push.apply( array, OT_getHorizontalLineIndexArray(x+i, y, 0, point, direction, 1) );
				break;

			case DirectionType.BOTTOM:
				Array.prototype.push.apply( array, OT_getHorizontalLineIndexArray(x, y+i, 0, point, direction, 1) );
				break;
		}
		
	}
	
	return unique(array);
};

//�u���X�^(�΂�)
OT_getDiagonalBreathIndexArray = function(x, y, startRange, endRange, direction, spread) {
	var array = [];
	var index = -1;
	
	for( var i=startRange ; i<=endRange ; i++ )
	{

		switch(direction) {
			case DirectionType.LEFT:
				Array.prototype.push.apply( array, OT_getLineIndexArray(x-i, y-i, 0, endRange-i*2, DirectionType.LEFT, 1 ) );
				Array.prototype.push.apply( array, OT_getLineIndexArray(x-i, y-i, 0, endRange-i*2, DirectionType.TOP , 1 ) );
				break;

			case DirectionType.TOP:
				Array.prototype.push.apply( array, OT_getLineIndexArray(x+i, y-i, 0, endRange-i*2, DirectionType.RIGHT, 1 ) );
				Array.prototype.push.apply( array, OT_getLineIndexArray(x+i, y-i, 0, endRange-i*2, DirectionType.TOP  , 1 ) );
				break;

			case DirectionType.RIGHT:
				Array.prototype.push.apply( array, OT_getLineIndexArray(x+i, y+i, 0, endRange-i*2, DirectionType.RIGHT  , 1 ) );
				Array.prototype.push.apply( array, OT_getLineIndexArray(x+i, y+i, 0, endRange-i*2, DirectionType.BOTTOM , 1 ) );
				break;

			case DirectionType.BOTTOM:
				Array.prototype.push.apply( array, OT_getLineIndexArray(x-i, y+i, 0, endRange-i*2, DirectionType.LEFT   , 1 ) );
				Array.prototype.push.apply( array, OT_getLineIndexArray(x-i, y+i, 0, endRange-i*2, DirectionType.BOTTOM , 1 ) );
				break;
		}
		
	}
	
	return unique(array);
};

//�u���X(�S����)
OT_getAllBreathIndexArray = function(x, y, startRange, endRange, spread) {
	var array = [];

	Array.prototype.push.apply( array, OT_getBreathIndexArray( x-1, y, startRange, endRange, 0, spread ) );
	Array.prototype.push.apply( array, OT_getBreathIndexArray( x, y-1, startRange, endRange, 1, spread ) );
	Array.prototype.push.apply( array, OT_getBreathIndexArray( x+1, y, startRange, endRange, 2, spread ) );
	Array.prototype.push.apply( array, OT_getBreathIndexArray( x, y+1, startRange, endRange, 3, spread ) );
	
	return unique(array);
};

//���ꕶ��
OT_getHorizontalLineIndexArray = function(x, y, startRange, endRange, direction, spread) {
	var array = [];
	var index = -1;
	for( var j=0 ; j<spread ; j++ )
	{
		for( var i=startRange ; i<=endRange ; i++ )
		{
			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x - j, y - i);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x - i, y - j);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}

			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x + j, y - i);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x - i, y + j);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
	
			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x - j, y + i);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x + i, y - j);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
			
			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x + j, y + i);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x + i, y + j);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
		}
	}
	return unique(array);
};

//���ꕶ��(�΂�)
OT_getDiagonalHorizontalLineIndexArray = function(x, y, startRange, endRange, direction, spread) {
	var array = [];
	var index = -1;
	for( var j=0 ; j<spread ; j++ )
	{
		var point1 = Math.floor( (1+j) / 2 );
		var point2 = Math.floor( (j) / 2 );
		for( var i=startRange ; i<=endRange ; i++ )
		{
			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x + i - point2, y - i - point1);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x - i - point1, y - i + point2);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}

			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x + i + point1, y - i + point2);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x - i + point2, y - i - point1);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
	
			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x - i - point1, y + i - point2);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x + i + point1, y + i - point2);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
			
			switch(direction) {
				case DirectionType.LEFT:
				case DirectionType.RIGHT:
					index = CurrentMap.getIndex(x - i + point2, y + i + point1);
					break;
	
				case DirectionType.TOP:
				case DirectionType.BOTTOM:
					index = CurrentMap.getIndex(x + i - point2, y + i + point1);
					break;
			}
			
			if(index != -1)
			{
				array.push(index);
			}
		}
	}
	return unique(array);
};

//�l�p
OT_getBoxIndexArray = function(x, y, startRange, endRange) {
	var array = [];
	var index = -1;
	var count = 1 + endRange*2;
	var ax = 0;
	var ay = 0;
	
	for( var i=-endRange ; i<=endRange ; i++ )
	{
		ax =  Math.abs( i );
		if( startRange > ax ) continue;

		for( var j=-endRange ; j<=endRange ; j++ )
		{
			ay =  Math.abs( j );
			if( startRange > ay ) continue;
			
			index = CurrentMap.getIndex(x+i, y+j);
			if(index != -1)
			{
				array.push(index);
			}
		}
	}
	
	return array;
};

//----------------------------------------------------------
// �֗��Ȋ֐��Q
//----------------------------------------------------------
// �z��̏d�����폜
function unique(array) {
	var storage = {};
	var uniqueArray = [];
	var i,value;
	for ( i=0; i<array.length; i++) {
		value = array[i];
		if (!(value in storage))
		{
			storage[value] = true;
			uniqueArray.push(value);
		}
	}
	return uniqueArray;
};

})();

