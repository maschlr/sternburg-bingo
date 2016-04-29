# -*- coding: utf-8 -*-
from app import db, lm, UserMixin

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    social_id = db.Column(db.String(64), nullable=False, unique=True)
    nickname = db.Column(db.String(64), nullable=False, unique=True)
    email = db.Column(db.String(64), nullable=False, unique=True)
    caps = db.relationship('Cap', backref='owner', lazy='dynamic')

    @property
    def is_authenticated(seld):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return '<User {}>'.format(self.nickname)

@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

class Cap(db.Model):
    __tablename__ = 'caps'
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer)
    count = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __repr__(self):
        return '<Cap {}, number {}, count {}, user.id {}>'.format(self.id, self.number, self.count, self.user_id)
