--
-- PostgreSQL database dump
--

-- Dumped from database version 10.13 (Debian 10.13-1.pgdg90+1)
-- Dumped by pg_dump version 11.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: cd_configurations; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.cd_configurations (
    id character varying NOT NULL,
    name character varying NOT NULL,
    configuration_data text NOT NULL,
    user_id character varying NOT NULL,
    workspace_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    type character varying
);


ALTER TABLE public.cd_configurations OWNER TO darwin;

--
-- Name: component_deployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.component_deployments (
    id character varying NOT NULL,
    module_deployment_id character varying NOT NULL,
    component_id character varying NOT NULL,
    build_image_url character varying NOT NULL,
    build_image_tag character varying NOT NULL,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    component_name character varying NOT NULL,
    context_path character varying,
    health_check character varying,
    port integer,
    finished_at timestamp without time zone
);


ALTER TABLE public.component_deployments OWNER TO darwin;

--
-- Name: component_undeployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.component_undeployments (
    id character varying NOT NULL,
    module_undeployment_id character varying NOT NULL,
    component_deployment_id character varying NOT NULL,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    finished_at timestamp without time zone
);


ALTER TABLE public.component_undeployments OWNER TO darwin;

--
-- Name: components; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.components (
    id character varying NOT NULL,
    module_id character varying NOT NULL,
    pipeline_options jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.components OWNER TO darwin;

--
-- Name: darwin-deploy-migrations; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public."darwin-deploy-migrations" (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public."darwin-deploy-migrations" OWNER TO darwin;

--
-- Name: darwin-deploy-migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: darwin
--

CREATE SEQUENCE public."darwin-deploy-migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."darwin-deploy-migrations_id_seq" OWNER TO darwin;

--
-- Name: darwin-deploy-migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: darwin
--

ALTER SEQUENCE public."darwin-deploy-migrations_id_seq" OWNED BY public."darwin-deploy-migrations".id;


--
-- Name: deployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.deployments (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    description character varying NOT NULL,
    callback_url character varying NOT NULL,
    default_circle boolean NOT NULL,
    circle jsonb,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    application_name character varying NOT NULL,
    circle_id character varying,
    finished_at timestamp without time zone,
    cd_configuration_id character varying
);


ALTER TABLE public.deployments OWNER TO darwin;

--
-- Name: COLUMN deployments.circle; Type: COMMENT; Schema: public; Owner: darwin
--

COMMENT ON COLUMN public.deployments.circle IS 'undefined';


--
-- Name: module_deployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.module_deployments (
    id character varying NOT NULL,
    deployment_id character varying NOT NULL,
    module_id character varying NOT NULL,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    k8s_configuration_id character varying,
    helm_repository character varying,
    finished_at timestamp without time zone
);


ALTER TABLE public.module_deployments OWNER TO darwin;

--
-- Name: module_undeployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.module_undeployments (
    id character varying NOT NULL,
    undeployment_id character varying NOT NULL,
    module_deployment_id character varying NOT NULL,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    finished_at timestamp without time zone
);


ALTER TABLE public.module_undeployments OWNER TO darwin;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.modules (
    id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.modules OWNER TO darwin;

--
-- Name: queued_deployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.queued_deployments (
    id integer NOT NULL,
    component_id character varying NOT NULL,
    component_deployment_id character varying NOT NULL,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    type character varying DEFAULT 'QueuedDeploymentEntity'::character varying NOT NULL,
    component_undeployment_id character varying
);


ALTER TABLE public.queued_deployments OWNER TO darwin;

--
-- Name: queued_deployments_id_seq; Type: SEQUENCE; Schema: public; Owner: darwin
--

CREATE SEQUENCE public.queued_deployments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.queued_deployments_id_seq OWNER TO darwin;

--
-- Name: queued_deployments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: darwin
--

ALTER SEQUENCE public.queued_deployments_id_seq OWNED BY public.queued_deployments.id;


--
-- Name: queued_istio_deployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.queued_istio_deployments (
    id integer NOT NULL,
    deployment_id character varying NOT NULL,
    component_id character varying NOT NULL,
    component_deployment_id character varying NOT NULL,
    circle_id character varying NOT NULL,
    status character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.queued_istio_deployments OWNER TO darwin;

--
-- Name: queued_istio_deployments_id_seq; Type: SEQUENCE; Schema: public; Owner: darwin
--

CREATE SEQUENCE public.queued_istio_deployments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.queued_istio_deployments_id_seq OWNER TO darwin;

--
-- Name: queued_istio_deployments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: darwin
--

ALTER SEQUENCE public.queued_istio_deployments_id_seq OWNED BY public.queued_istio_deployments.id;


--
-- Name: undeployments; Type: TABLE; Schema: public; Owner: darwin
--

CREATE TABLE public.undeployments (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    deployment_id character varying NOT NULL,
    status character varying NOT NULL,
    circle_id character varying,
    finished_at timestamp without time zone
);


ALTER TABLE public.undeployments OWNER TO darwin;

--
-- Name: darwin-deploy-migrations id; Type: DEFAULT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public."darwin-deploy-migrations" ALTER COLUMN id SET DEFAULT nextval('public."darwin-deploy-migrations_id_seq"'::regclass);


--
-- Name: queued_deployments id; Type: DEFAULT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.queued_deployments ALTER COLUMN id SET DEFAULT nextval('public.queued_deployments_id_seq'::regclass);


--
-- Name: queued_istio_deployments id; Type: DEFAULT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.queued_istio_deployments ALTER COLUMN id SET DEFAULT nextval('public.queued_istio_deployments_id_seq'::regclass);


--
-- Name: components PK_0d742661c63926321b5f5eac1ad; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.components
    ADD CONSTRAINT "PK_0d742661c63926321b5f5eac1ad" PRIMARY KEY (id);


--
-- Name: cd_configurations PK_144238f578afbf2be3d2d089374; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.cd_configurations
    ADD CONSTRAINT "PK_144238f578afbf2be3d2d089374" PRIMARY KEY (id);


--
-- Name: undeployments PK_1d20368420a41b7e0bd3d35de15; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.undeployments
    ADD CONSTRAINT "PK_1d20368420a41b7e0bd3d35de15" PRIMARY KEY (id);


--
-- Name: deployments PK_1e5627acb3c950deb83fe98fc48; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.deployments
    ADD CONSTRAINT "PK_1e5627acb3c950deb83fe98fc48" PRIMARY KEY (id);


--
-- Name: queued_istio_deployments PK_1f43f203a1183f5e782493dd76b; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.queued_istio_deployments
    ADD CONSTRAINT "PK_1f43f203a1183f5e782493dd76b" PRIMARY KEY (id);


--
-- Name: component_undeployments PK_2eed8d07fca1801d112366f6d28; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.component_undeployments
    ADD CONSTRAINT "PK_2eed8d07fca1801d112366f6d28" PRIMARY KEY (id);


--
-- Name: component_deployments PK_449644d91ed9f487c4badf00451; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.component_deployments
    ADD CONSTRAINT "PK_449644d91ed9f487c4badf00451" PRIMARY KEY (id);


--
-- Name: module_deployments PK_659527acfd39f8cb4c9fc570459; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.module_deployments
    ADD CONSTRAINT "PK_659527acfd39f8cb4c9fc570459" PRIMARY KEY (id);


--
-- Name: modules PK_7dbefd488bd96c5bf31f0ce0c95; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT "PK_7dbefd488bd96c5bf31f0ce0c95" PRIMARY KEY (id);


--
-- Name: module_undeployments PK_8b5a7e3a9e9f8cd190f12ef87c9; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.module_undeployments
    ADD CONSTRAINT "PK_8b5a7e3a9e9f8cd190f12ef87c9" PRIMARY KEY (id);


--
-- Name: darwin-deploy-migrations PK_a12a9dfa463245090d8761a0ee0; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public."darwin-deploy-migrations"
    ADD CONSTRAINT "PK_a12a9dfa463245090d8761a0ee0" PRIMARY KEY (id);


--
-- Name: queued_deployments PK_fc6b9d6254029d3f1ae5dfd7e77; Type: CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.queued_deployments
    ADD CONSTRAINT "PK_fc6b9d6254029d3f1ae5dfd7e77" PRIMARY KEY (id);


--
-- Name: queued_deployments_status_running_uniq; Type: INDEX; Schema: public; Owner: darwin
--

CREATE UNIQUE INDEX queued_deployments_status_running_uniq ON public.queued_deployments USING btree (component_id, status) WHERE ((status)::text = 'RUNNING'::text);


--
-- Name: deployments deployment_cd_configuration_fk; Type: FK CONSTRAINT; Schema: public; Owner: darwin
--

ALTER TABLE ONLY public.deployments
    ADD CONSTRAINT deployment_cd_configuration_fk FOREIGN KEY (cd_configuration_id) REFERENCES public.cd_configurations(id);


--
-- PostgreSQL database dump complete
--

