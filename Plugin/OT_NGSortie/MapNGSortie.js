
/*--------------------------------------------------------------------------
  
  �}�b�v�ɏo���֎~���j�b�g�̐ݒ��ǉ����܂��B

  �g�p���@:
  �}�b�v���̃J�X�^���p�����[�^�ɂ�
  { OT_NGSortie:{ ���j�b�gID:�t���O, ���j�b�gID:�t���O, �c } }
  �Ɛݒ肷��B
  �t���O��0�ŏo���A1�ŏo���֎~�ƂȂ�܂��B
  
  ���}�b�v�ɐݒ肳�ꂽ���j�b�g�̏o���֎~�t���O��
    EventNGSortie.js�ł̃��j�b�g���̏o���֎~�t���O�ݒ���D�悳��܂�
  
  �쐬��:
  o-to
  
  �X�V����:
  2015/9/6:�V�K�쐬
  
--------------------------------------------------------------------------*/

var OT_NGSortieColor = 0x006296;

(function() {

UnitSortieListScrollbar.playSelectSound = function() {
	var object = this.getObject();
	var isSelect = true;
	
	if (this._isForceSortie(object) || this._isNGForceSortie(object)) {
		isSelect = false;
	}
	else if (SceneManager.getActiveScene().getSortieSetting().getSortieCount() === root.getCurrentSession().getCurrentMapInfo().getSortieMaxCount()) {
		if (object.getSortieState() === SortieType.SORTIE) {
			isSelect = true;
		}
		else {
			isSelect = false;
		}
	}
	
	if (isSelect) {
		MediaControl.soundDirect('commandselect');
	}
	else {
		MediaControl.soundDirect('operationblock');
	}
};

var alias1 = UnitSortieListScrollbar._getSortieColor;
UnitSortieListScrollbar._getSortieColor = function(object) {
	if (this._isNGForceSortie(object)) {
		return OT_NGSortieColor;
	}

	return alias1.call(this, object);
};
	
UnitSortieListScrollbar._isNGForceSortie = function(object) {
	return SceneManager.getActiveScene().getSortieSetting().isNGForceSortie(object);
};

SortieSetting._setInitialUnitPos = function() {
	var i, unit;
	var list = PlayerList.getAliveList();
	var count = list.getCount();
	var maxCount = this._sortiePosArray.length;
	var sortieCount = 0;
	
	// ���݂̃}�b�v�̐퓬������ʂň�x�ł��Z�[�u���s���ƁAisFirstSetup��false��Ԃ�
	if (!root.getMetaSession().isFirstSetup()) {
		// ���݂̃��j�b�g�ʒu����ɁA_sortiePosArray��unit������������
		this._arrangeUnitPos();
		return;
	}
	
	// ���߂Đ퓬������ʂ��\�������ꍇ�́A�㑱�̏����ɂ���ďo����Ԃ������Őݒ肳���
	
	this._clearSortieList();
	
	// �����o��(�ʒu�w�肠��)�̃��j�b�g���A���ɏo����Ԃɂ���
	for (i = 0; i < count && sortieCount < maxCount; i++) {
		unit = list.getData(i);
		if (this.isForceSortie(unit)) {
			if (this._sortieFixedUnit(unit)) {
				sortieCount++;
			}
		}
	}
	
	// �����o��(�ʒu�w��Ȃ�)�̃��j�b�g���A���ɏo����Ԃɂ���
	for (i = 0; i < count && sortieCount < maxCount; i++) {
		unit = list.getData(i);
		if (this.isForceSortie(unit) && unit.getSortieState() !== SortieType.SORTIE) {
			if (this._sortieUnit(unit)) {
				sortieCount++;
			}
		}
	}
	
	// �o���֎~�ȊO�̃��j�b�g���A���ɏo����Ԃɂ���
	for (i = 0; i < count && sortieCount < maxCount; i++) {
		unit = list.getData(i);
		if (!this.isNGForceSortie(unit) && unit.getSortieState() !== SortieType.SORTIE) {
			if (this._sortieUnit(unit)) {
				sortieCount++;
			}
		}
	}
	
};

var alias2 = SortieSetting.setSortieMark;
SortieSetting.setSortieMark = function(index) {
	var list = PlayerList.getAliveList();
	var unit = list.getData(index);
	
	if ( this.isNGForceSortie(unit) )
	{	
		//root.log( unit.getId() );
		return false;
	}
	
	return alias2.call(this, index);
};

SortieSetting.isNGForceSortie = function(unit) {	
	var i, forceSortie;
	var mapInfo = root.getCurrentSession().getCurrentMapInfo();
	var NGSortie = mapInfo.custom.OT_NGSortie;
	var NGSortieList = root.getMetaSession().global.OT_NGSortieList;

	// �}�b�v�ݒ�ł̃L�����̏o���֎~�m�F
	if( NGSortie != null )
	{
		//root.log( unit.getId() );
		for (var j in NGSortie)
		{
			//root.log( j + NGSortie[j] );
			if( unit.getId() == j )
			{
				if( NGSortie[j] == 1 )
				{
					return true;
				}
				else if( NGSortie[j] == 0 )
				{
					return false;
				}
			}
		}
	}

	// �C�x���g�ݒ�ł̏o���֎~�L����
	if( NGSortieList != null )
	{
		for (var j in NGSortieList)
		{
			//root.log( j + NGSortieList[j] );
			if ( unit.getId() == j && NGSortieList[j] == 1 ) {
				return true;
			}
		}
	}
	
	return false;
};
	
})();

