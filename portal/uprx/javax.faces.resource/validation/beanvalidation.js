// xhtml?ln=primefaces&v=5.2

if (window.PrimeFaces) {
    PrimeFaces.locales.en_US.messages["javax.faces.validator.BeanValidator.MESSAGE"] = "{0}";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.AssertFalse.message"] = "must be false";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.AssertTrue.message"] = "must be true";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.DecimalMax.message"] = "must be less than or equal to {0}";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.DecimalMin.message"] = "must be greater than or equal to {0}";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Digits.message"] = "numeric value out of bounds (<{0} digits>.<{1} digits> expected)";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Future.message"] = "must be in the future";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Max.message"] = "must be less than or equal to {0}";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Min.message"] = "must be greater than or equal to {0}";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.NotNull.message"] = "may not be null";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Null.message"] = "must be null";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Past.message"] = "must be in the past";
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Pattern.message"] = 'must match "{0}"';
    PrimeFaces.locales.en_US.messages["javax.validation.constraints.Size.message"] = "size must be between {0} and {1}";
    PrimeFaces.validator.NotNull = {
        MESSAGE_ID: "javax.validation.constraints.NotNull.message",
        validate: function(b, c) {
            if (c === null || c === undefined) {
                var a = PrimeFaces.util.ValidationContext;
                throw a.getMessageBV(b, this.MESSAGE_ID, b.data("p-notnull-msg"))
            }
        }
    };
    PrimeFaces.validator.Null = {
        MESSAGE_ID: "javax.validation.constraints.Null.message",
        validate: function(b, c) {
            if (c !== null) {
                var a = PrimeFaces.util.ValidationContext;
                throw a.getMessageBV(b, this.MESSAGE_ID, b.data("p-null-msg"))
            }
        }
    };
    PrimeFaces.validator.Size = {
        MESSAGE_ID: "javax.validation.constraints.Size.message",
        validate: function(d, f) {
            if (f !== null) {
                var e = d.val().length
                  , c = d.data("p-minlength")
                  , a = d.data("p-maxlength")
                  , b = PrimeFaces.util.ValidationContext;
                if (e < c || e > a) {
                    throw b.getMessageBV(d, this.MESSAGE_ID, d.data("p-size-msg"), c, a)
                }
            }
        }
    };
    PrimeFaces.validator.Min = {
        MESSAGE_ID: "javax.validation.constraints.Min.message",
        validate: function(c, d) {
            if (d !== null) {
                var b = c.data("p-minvalue")
                  , a = PrimeFaces.util.ValidationContext;
                if (d < b) {
                    throw a.getMessageBV(c, this.MESSAGE_ID, c.data("p-min-msg"), b)
                }
            }
        }
    };
    PrimeFaces.validator.Max = {
        MESSAGE_ID: "javax.validation.constraints.Max.message",
        validate: function(c, d) {
            if (d !== null) {
                var a = c.data("p-maxvalue")
                  , b = PrimeFaces.util.ValidationContext;
                if (d > a) {
                    throw b.getMessageBV(c, this.MESSAGE_ID, c.data("p-max-msg"), a)
                }
            }
        }
    };
    PrimeFaces.validator.DecimalMin = {
        MESSAGE_ID: "javax.validation.constraints.DecimalMin.message",
        validate: function(c, d) {
            if (d !== null) {
                var b = c.data("p-minvalue")
                  , a = PrimeFaces.util.ValidationContext;
                if (d < b) {
                    throw a.getMessageBV(c, this.MESSAGE_ID, c.data("p-decimalmin-msg"), b)
                }
            }
        }
    };
    PrimeFaces.validator.DecimalMax = {
        MESSAGE_ID: "javax.validation.constraints.DecimalMax.message",
        validate: function(c, d) {
            if (d !== null) {
                var a = c.data("p-maxvalue")
                  , b = PrimeFaces.util.ValidationContext;
                if (d > a) {
                    throw b.getMessageBV(c, this.MESSAGE_ID, c.data("p-decimalmax-msg"), a)
                }
            }
        }
    };
    PrimeFaces.validator.AssertTrue = {
        MESSAGE_ID: "javax.validation.constraints.AssertTrue.message",
        validate: function(b, c) {
            if (c === false) {
                var a = PrimeFaces.util.ValidationContext;
                throw a.getMessageBV(b, this.MESSAGE_ID, b.data("p-atrue-msg"))
            }
        }
    };
    PrimeFaces.validator.AssertFalse = {
        MESSAGE_ID: "javax.validation.constraints.AssertFalse.message",
        validate: function(b, c) {
            if (c === true) {
                var a = PrimeFaces.util.ValidationContext;
                throw a.getMessageBV(b, this.MESSAGE_ID, b.data("p-afalse-msg"))
            }
        }
    };
    PrimeFaces.validator.Past = {
        MESSAGE_ID: "javax.validation.constraints.Past.message",
        validate: function(b, c) {
            if (c !== null && c >= new Date()) {
                var a = PrimeFaces.util.ValidationContext;
                throw a.getMessageBV(b, this.MESSAGE_ID, b.data("p-past-msg"))
            }
        }
    };
    PrimeFaces.validator.Future = {
        MESSAGE_ID: "javax.validation.constraints.Future.message",
        validate: function(b, c) {
            if (c !== null && c <= new Date()) {
                var a = PrimeFaces.util.ValidationContext;
                throw a.getMessageBV(b, this.MESSAGE_ID, b.data("p-future-msg"))
            }
        }
    };
    PrimeFaces.validator.Pattern = {
        MESSAGE_ID: "javax.validation.constraints.Pattern.message",
        validate: function(b, e) {
            if (e !== null) {
                var d = b.data("p-pattern")
                  , a = PrimeFaces.util.ValidationContext
                  , c = new RegExp(d);
                if (!c.test(e)) {
                    throw a.getMessageBV(b, this.MESSAGE_ID, b.data("p-pattern-msg"), d)
                }
            }
        }
    };
    PrimeFaces.validator.Digits = {
        MESSAGE_ID: "javax.validation.constraints.Digits.message",
        validate: function(e, i) {
            if (i !== null) {
                var c = e.data("p-dintvalue")
                  , d = e.data("p-dfracvalue")
                  , f = PrimeFaces.util.ValidationContext
                  , h = f.getLocaleSettings();
                var g = i.toString().split(h.decimalSeparator)
                  , b = g[0].replace(new RegExp(h.groupingSeparator,"g"), "")
                  , a = g[1];
                if (c !== undefined && b && c < b.length || d !== undefined && a && a.length > d) {
                    throw f.getMessageBV(e, this.MESSAGE_ID, e.data("p-digits-msg"), c, d)
                }
            }
        }
    };
    PrimeFaces.util.ValidationContext.getMessageBV = function(e, c, b) {
        if (b && b.charAt(0) !== "{") {
            return {
                summary: b,
                detail: b
            }
        } else {
            var j = c;
            if (b && b.charAt(0) === "{") {
                j = b.substring(1, b.length - 1)
            }
            var i = PrimeFaces.util.ValidationContext.getLocaleSettings();
            var k = (i.messages && i.messages[j]) ? i : PrimeFaces.locales.en_US;
            var g = k.messages[j];
            var f = k.messages[j + "_detail"];
            if (g) {
                g = this.formatBV(g, arguments);
                f = (f) ? this.formatBV(f, arguments) : g;
                var d = (i.messages && i.messages["javax.faces.validator.BeanValidator.MESSAGE"]) ? i : PrimeFaces.locales.en_US;
                var a = d.messages["javax.faces.validator.BeanValidator.MESSAGE"];
                var h = PrimeFaces.util.ValidationContext.getLabel(e);
                g = a.replace("{0}", g).replace("{1}", h);
                f = a.replace("{0}", f).replace("{1}", h);
                return {
                    summary: g,
                    detail: f
                }
            } else {
                return {
                    summary: "### Message '" + j + "' not found ###",
                    detail: "### Message '" + j + "' not found ###"
                }
            }
        }
    }
    ;
    PrimeFaces.util.ValidationContext.formatBV = function(e, d) {
        var c = e;
        for (var a = 3; a < d.length; a++) {
            var b = new RegExp("\\{" + (a - 3) + "\\}","gm");
            c = c.replace(b, d[a])
        }
        return c
    }
}
;