"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WsGenerator_1 = require("../../../../util/WsGenerator");
const Random_1 = require("../../../../util/Random");
const Formatter_1 = require("../../../../util/Formatter");
let ScalarProduct = class ScalarProduct {
    constructor(qGenOpts) {
        this.qGenOpts = qGenOpts;
        const rnd = qGenOpts.rand || new Random_1.Random();
        const r = qGenOpts.question.interval || 10;
        const shuffle = qGenOpts.question.shuffle;
        const vecV = qGenOpts.scope.vecV;
        const vecU = qGenOpts.scope.vecU;
        const vecW = qGenOpts.scope.vecW;
        const num1 = rnd.numericBetweenNotZero(-r, r);
        const num2 = rnd.numericBetweenNotZero(-r, r);
        const combLineal = vecV.times(num1).add(vecW.times(num2));
        const op1 = vecU.dotProduct(combLineal);
        let term2 = Formatter_1.Formatter.numericXstringTeX(true, num1, vecV.arrow, num2, vecW.arrow);
        const apartats = [
            {
                question: `$ ${vecU.arrow} \\cdot \\left( ${term2} \\right) $`,
                answer: '$' + op1.toTeX() + '$'
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            },
            {
                question: '',
                answer: ''
            }
        ];
        this.apartats = rnd.shuffle(apartats);
        this.index = -1;
    }
    getFormulation() {
        return __awaiter(this, void 0, void 0, function* () {
            this.index += 1;
            if (this.index > this.apartats.length - 1) {
                this.index = -1;
            }
            return this.apartats[this.index];
        });
    }
    getAnswer() {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
};
ScalarProduct = __decorate([
    WsGenerator_1.WsGenerator({
        category: "geometry/vectors/scalar_product",
        parameters: [
            {
                name: "interval",
                defaults: 10,
                description: "Range in which random coefficients are generated"
            },
            {
                name: "vecU",
                defaults: null,
                description: "Vector object u"
            },
            {
                name: "vecV",
                defaults: null,
                description: "Vector object v"
            },
            {
                name: "vecW",
                defaults: null,
                description: "Vector object w"
            }
        ]
    }),
    __metadata("design:paramtypes", [Object])
], ScalarProduct);
exports.ScalarProduct = ScalarProduct;
//# sourceMappingURL=ScalarProduct.js.map