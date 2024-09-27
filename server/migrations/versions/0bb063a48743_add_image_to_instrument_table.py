"""add image to instrument table

Revision ID: 0bb063a48743
Revises: 749b52c86b83
Create Date: 2024-09-23 10:51:57.261331

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0bb063a48743'
down_revision = '749b52c86b83'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('instruments', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('instruments', schema=None) as batch_op:
        batch_op.drop_column('image')

    # ### end Alembic commands ###