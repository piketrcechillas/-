
/*--------------------------------------------------------------------------
  
  ��MapNGSortie.js�ƃZ�b�g�œ������鎖

  �u�X�N���v�g�̎��s�v�́u�R�[�h�̎��s�v����
  ���j�b�g�̏o���֎~�t���O��ݒ�ł���悤�ɂȂ�܂��B
  �o���֎~�t���O���������L�����͏o�������ɂďo���I�����s�\�ɂȂ�܂�
  �o���֎~�Őݒ�ł�����͉̂��L�̒ʂ�ł��B

  �E�ʂŏo���֎~�t���O��ݒ�				SetNGSortieList( { ���j�b�gID:�t���O, �c } );
  �E�S�L�����o���֎~						AllNGSortieList();
  �E�S�L�����o���֎~�t���O����				SetNGSortieList();
  �E�o�������L���������o���֎~�ɂ���		AddSortieNGSortieList();
  �E�o�����Ă��Ȃ��L�������o���֎~�ɂ���	AddNonSortieNGSortieList();

  �g�p���@
  
  ���o���֎~�t���O�ݒ�:
  �C�x���g�R�}���h�́u�X�N���v�g�̎��s�v�Łu�R�[�h�̎��s�v�Ƀ`�F�b�N���A
  �e�L�X�g�̈��
  SetNGSortieList(
    { ���j�b�gID:�t���O, ���j�b�gID:�t���O, �c }
  );
  �̂悤�ɋL�q���܂��B
  �t���O�̕����́A1�ŏo���֎~�A0�ŏo���֎~�����ƂȂ�܂��B
  
  ��F���j�b�g�ԍ�0���o���֎~�A���j�b�g�ԍ�2���o���֎~��������
  SetNGSortieList(
    { 0:1, 2:0 }
  );

  ���S�L�����o���֎~:
  �e�L�X�g�̈��AllNGSortieList();�ƋL�q���܂��B
  �ꕔ�̃L�����̂ݏo����(�����������ł͂Ȃ�)�ɂ���������
  AllNGSortieList()�őS�L��������U�o���֎~�ɂ���
  SetNGSortieList({�c})�ŌʂŐݒ肷�鎖���I�X�X�����܂��B
  
  ���S�L�����o���֎~�t���O����:
  �e�L�X�g�̈��SetNGSortieList();�ƋL�q���܂��B

  ���o�������L���������o���֎~�ɂ���:
  �e�L�X�g�̈��AddSortieNGSortieList();�ƋL�q���܂��B
  �����\���̃}�b�v�ŕ����𕪂���Ƃ����V�`���G�[�V�����̎��Ȃǂɗ��p���܂��B
  (�g�p����ꍇ�̓}�b�v�N���A�O�Ɏg�p���Ă�������)

  ���o�����Ă��Ȃ��L�������o���֎~�ɂ���:
  �e�L�X�g�̈��AddNonSortieNGSortieList();�ƋL�q���܂��B
  �����\���̃}�b�v�ŏo����������
  �O�}�b�v�ŏo�������L�����������o���ɂ��������ɗ��p���܂��B
  (�g�p����ꍇ�̓}�b�v�N���A�O�Ɏg�p���Ă�������)

  �쐬��:
  o-to
  
  �X�V����:
  2015/9/6:�V�K�쐬
  2016/02/28:
  1.060�Ή��A�����֐��폜�ɂ���ăG���[�ƂȂ��Ă������ߏC��
  
  2017/02/05:
  for���[�v�p�Ɏg�p���Ă���ϐ��̐錾�Y�ꂵ�Ă���ӏ����C��
  �������悤�ɐ錾�Y�ꂵ�Ă���ʃX�N���v�g���������ꍇ�A�Ӑ}���ʓ��삪�N���邽��

--------------------------------------------------------------------------*/

// �w�肵�����j�b�g�̏o���֎~��Ԃ�ݒ�
function SetNGSortieList(aryList)
{
	//root.log( aryList );
	if( aryList != null )
	{
		if(root.getMetaSession().global.OT_NGSortieList == null)
		{
			root.getMetaSession().global.OT_NGSortieList = {};
		}
		
		for (var j in aryList)
		{
			//root.log( j + aryList[j]);
			root.getMetaSession().global.OT_NGSortieList[j] = aryList[j];
		}
	}
	else
	{
		root.getMetaSession().global.OT_NGSortieList = {};
	}
}

// �S���j�b�g�o���֎~
function AllNGSortieList()
{
	var list = PlayerList.getMainList();
	var count = list.getCount();
	root.getMetaSession().global.OT_NGSortieList = {};
	
	for (var i = 0; i < count ; i++) {
		root.getMetaSession().global.OT_NGSortieList[i] = 1;
	}

}

// ���̐퓬�ɎQ�������o�����j�b�g���o���֎~�ɂ���
function AddSortieNGSortieList()
{
	var list = PlayerList.getSortieList();
	var count = list.getCount();
	if(root.getMetaSession().global.OT_NGSortieList == null)
	{
		root.getMetaSession().global.OT_NGSortieList = {};
	}

	// �o�����j�b�g���A�o���֎~��Ԃɂ���
	for (var i = 0; i < count ; i++) {
		var unit = list.getData(i);
		root.getMetaSession().global.OT_NGSortieList[unit.getId()] = 1;
	}
}

// ���̐퓬�ɎQ�����Ă��Ȃ����j�b�g���o���֎~�ɂ���
function AddNonSortieNGSortieList()
{
	var list = PlayerList.getMainList();
	var count = list.getCount();
	if(root.getMetaSession().global.OT_NGSortieList == null)
	{
		root.getMetaSession().global.OT_NGSortieList = {};
	}

	// �o�����Ă��Ȃ����j�b�g���A�o���֎~��Ԃɂ���
	for (var i = 0; i < count ; i++) {
		var unit = list.getData(i);
		
		if(unit.getSortieState() !== SortieType.SORTIE)
		{
			root.getMetaSession().global.OT_NGSortieList[unit.getId()] = 1;
		}
	}
}

